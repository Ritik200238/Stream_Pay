#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::{AccountOwner, Amount, Timestamp, WithContractAbi},
    views::{RootView, View},
    Contract, ContractRuntime,
};
use stream::{
    Stream, StreamAbi, StreamMessage, StreamOperation, StreamParameters,
    StreamResponse, StreamStatus,
};

use self::state::StreamState;

pub struct StreamContract {
    state: StreamState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(StreamContract);

impl WithContractAbi for StreamContract {
    type Abi = StreamAbi;
}

impl Contract for StreamContract {
    type Message = StreamMessage;
    type Parameters = StreamParameters;
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = StreamState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        StreamContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        let _ = self.runtime.application_parameters();
        *self.state.next_stream_id.get_mut() = 1;
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        let current_time = self.runtime.system_time();

        match operation {
            StreamOperation::CreateStream {
                recipient,
                rate_per_second,
                duration_seconds,
            } => {
                let sender = match self.runtime.authenticated_signer() {
                    Some(signer) => signer.into(),
                    None => return StreamResponse::Error("Not authenticated".to_string()),
                };

                let rate = match rate_per_second.parse::<u128>() {
                    Ok(r) => Amount::from_attos(r),
                    Err(_) => return StreamResponse::Error("Invalid rate".to_string()),
                };

                if rate == Amount::ZERO {
                    return StreamResponse::Error("Rate must be > 0".to_string());
                }

                let end_time = duration_seconds.map(|dur| {
                    let micros = dur * 1_000_000;
                    Timestamp::from(current_time.micros().saturating_add(micros))
                });

                let stream_id = *self.state.next_stream_id.get();
                let stream = Stream {
                    id: stream_id,
                    sender,
                    recipient,
                    rate_per_second: rate,
                    start_time: current_time,
                    end_time,
                    paused_at: None,
                    total_deposited: Amount::ZERO,
                    total_withdrawn: Amount::ZERO,
                    status: StreamStatus::Active,
                };

                self.state.streams.insert(&stream_id, stream).unwrap();
                *self.state.next_stream_id.get_mut() = stream_id + 1;

                self.state.add_stream_to_sender(sender, stream_id).await;
                self.state.add_stream_to_recipient(recipient, stream_id).await;

                StreamResponse::StreamId(stream_id)
            }

            StreamOperation::PauseStream { stream_id } => {
                let sender = match self.runtime.authenticated_signer() {
                    Some(s) => s.into(),
                    None => return StreamResponse::Error("Not authenticated".to_string()),
                };

                let mut stream = match self.state.streams.get(&stream_id).await.unwrap() {
                    Some(s) => s,
                    None => return StreamResponse::Error("Stream not found".to_string()),
                };

                if stream.sender != sender {
                    return StreamResponse::Error("Only sender can pause".to_string());
                }

                if stream.status != StreamStatus::Active {
                    return StreamResponse::Error("Stream not active".to_string());
                }

                stream.status = StreamStatus::Paused;
                stream.paused_at = Some(current_time);
                self.state.streams.insert(&stream_id, stream).unwrap();

                StreamResponse::Ok
            }

            StreamOperation::ResumeStream { stream_id } => {
                let sender = match self.runtime.authenticated_signer() {
                    Some(s) => s.into(),
                    None => return StreamResponse::Error("Not authenticated".to_string()),
                };

                let mut stream = match self.state.streams.get(&stream_id).await.unwrap() {
                    Some(s) => s,
                    None => return StreamResponse::Error("Stream not found".to_string()),
                };

                if stream.sender != sender {
                    return StreamResponse::Error("Only sender can resume".to_string());
                }

                if stream.status != StreamStatus::Paused {
                    return StreamResponse::Error("Stream not paused".to_string());
                }

                stream.status = StreamStatus::Active;
                stream.paused_at = None;
                self.state.streams.insert(&stream_id, stream).unwrap();

                StreamResponse::Ok
            }

            StreamOperation::StopStream { stream_id } => {
                let sender = match self.runtime.authenticated_signer() {
                    Some(s) => s.into(),
                    None => return StreamResponse::Error("Not authenticated".to_string()),
                };

                let mut stream = match self.state.streams.get(&stream_id).await.unwrap() {
                    Some(s) => s,
                    None => return StreamResponse::Error("Stream not found".to_string()),
                };

                if stream.sender != sender {
                    return StreamResponse::Error("Only sender can stop".to_string());
                }

                stream.status = StreamStatus::Stopped;
                stream.end_time = Some(current_time);
                self.state.streams.insert(&stream_id, stream).unwrap();

                StreamResponse::Ok
            }

            StreamOperation::WithdrawFromStream { stream_id, amount } => {
                let recipient = match self.runtime.authenticated_signer() {
                    Some(s) => s.into(),
                    None => return StreamResponse::Error("Not authenticated".to_string()),
                };

                let mut stream = match self.state.streams.get(&stream_id).await.unwrap() {
                    Some(s) => s,
                    None => return StreamResponse::Error("Stream not found".to_string()),
                };

                if stream.recipient != recipient {
                    return StreamResponse::Error("Only recipient can withdraw".to_string());
                }

                let available = self.state.calculate_earned_amount(&stream, current_time);

                let withdraw_amount = if let Some(amt_str) = amount {
                    match amt_str.parse::<u128>() {
                        Ok(a) => Amount::from_attos(a),
                        Err(_) => return StreamResponse::Error("Invalid amount".to_string()),
                    }
                } else {
                    available
                };

                if withdraw_amount > available {
                    return StreamResponse::Error(format!(
                        "Insufficient earned amount. Available: {}, Requested: {}",
                        available, withdraw_amount
                    ));
                }

                stream.total_withdrawn = stream.total_withdrawn.saturating_add(withdraw_amount);
                self.state.streams.insert(&stream_id, stream).unwrap();

                // Note: In production, you'd call token app to transfer funds here
                // For now, we'll just track the withdrawal

                StreamResponse::Amount(withdraw_amount)
            }

            StreamOperation::TopUpStream { stream_id, amount } => {
                let sender = match self.runtime.authenticated_signer() {
                    Some(s) => s.into(),
                    None => return StreamResponse::Error("Not authenticated".to_string()),
                };

                let mut stream = match self.state.streams.get(&stream_id).await.unwrap() {
                    Some(s) => s,
                    None => return StreamResponse::Error("Stream not found".to_string()),
                };

                if stream.sender != sender {
                    return StreamResponse::Error("Only sender can top up".to_string());
                }

                let top_up_amount = match amount.parse::<u128>() {
                    Ok(a) => Amount::from_attos(a),
                    Err(_) => return StreamResponse::Error("Invalid amount".to_string()),
                };

                stream.total_deposited = stream.total_deposited.saturating_add(top_up_amount);
                self.state.streams.insert(&stream_id, stream).unwrap();

                StreamResponse::Ok
            }
        }
    }

    async fn execute_message(&mut self, _message: StreamMessage) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
