use async_graphql::SimpleObject;
use linera_sdk::{
    linera_base_types::{AccountOwner, Amount, Timestamp},
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
};
use stream::{Stream, StreamStatus};

#[derive(RootView, SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct StreamState {
    pub streams: MapView<u64, Stream>,
    pub next_stream_id: RegisterView<u64>,
    pub streams_by_sender: MapView<AccountOwner, Vec<u64>>,
    pub streams_by_recipient: MapView<AccountOwner, Vec<u64>>,
}

impl StreamState {
    /// Calculate how much has been earned but not withdrawn
    pub fn calculate_earned_amount(&self, stream: &Stream, current_time: Timestamp) -> Amount {
        let effective_time = match stream.status {
            StreamStatus::Active => current_time,
            StreamStatus::Paused => stream.paused_at.unwrap_or(current_time),
            StreamStatus::Completed | StreamStatus::Stopped => {
                stream.end_time.unwrap_or(current_time)
            }
        };

        // Handle case where effective_time is before start_time
        if effective_time <= stream.start_time {
            return Amount::ZERO;
        }

        let elapsed = effective_time
            .delta_since(stream.start_time)
            .as_micros();

        let seconds_elapsed = (elapsed / 1_000_000) as u128;

        // Total earned = rate * seconds
        let total_earned = stream.rate_per_second.saturating_mul(seconds_elapsed);

        // Available = earned - withdrawn
        total_earned.saturating_sub(stream.total_withdrawn)
    }

    /// Check if stream should be completed (duration expired)
    pub fn should_complete_stream(&self, stream: &Stream, current_time: Timestamp) -> bool {
        if let Some(end_time) = stream.end_time {
            current_time >= end_time
        } else {
            false
        }
    }

    pub async fn add_stream_to_sender(&mut self, sender: AccountOwner, stream_id: u64) {
        let mut sender_streams = self
            .streams_by_sender
            .get(&sender)
            .await
            .unwrap()
            .unwrap_or_default();
        sender_streams.push(stream_id);
        self.streams_by_sender
            .insert(&sender, sender_streams)
            .unwrap();
    }

    pub async fn add_stream_to_recipient(&mut self, recipient: AccountOwner, stream_id: u64) {
        let mut recipient_streams = self
            .streams_by_recipient
            .get(&recipient)
            .await
            .unwrap()
            .unwrap_or_default();
        recipient_streams.push(stream_id);
        self.streams_by_recipient
            .insert(&recipient, recipient_streams)
            .unwrap();
    }
}
