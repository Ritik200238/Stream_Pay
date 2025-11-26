#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{AccountOwner, WithServiceAbi},
    views::View,
    Service, ServiceRuntime,
};
use std::sync::Arc;
use stream::{Stream, StreamAbi, StreamOperation, StreamParameters};

use self::state::StreamState;

#[derive(Clone)]
pub struct StreamService {
    state: Arc<StreamState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(StreamService);

impl WithServiceAbi for StreamService {
    type Abi = StreamAbi;
}

impl Service for StreamService {
    type Parameters = StreamParameters;

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = StreamState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        StreamService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            self.clone(),
            StreamOperation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

#[Object]
impl StreamService {
    async fn stream(&self, id: u64) -> Option<Stream> {
        self.state.streams.get(&id).await.ok().flatten()
    }

    async fn streams_by_sender(&self, sender: String) -> Vec<Stream> {
        let owner: AccountOwner = match sender.parse() {
            Ok(o) => o,
            Err(_) => return vec![],
        };

        let stream_ids = self
            .state
            .streams_by_sender
            .get(&owner)
            .await
            .ok()
            .flatten()
            .unwrap_or_default();

        let mut streams = Vec::new();
        for id in stream_ids {
            if let Some(stream) = self.state.streams.get(&id).await.ok().flatten() {
                streams.push(stream);
            }
        }
        streams
    }

    async fn streams_by_recipient(&self, recipient: String) -> Vec<Stream> {
        let owner: AccountOwner = match recipient.parse() {
            Ok(o) => o,
            Err(_) => return vec![],
        };

        let stream_ids = self
            .state
            .streams_by_recipient
            .get(&owner)
            .await
            .ok()
            .flatten()
            .unwrap_or_default();

        let mut streams = Vec::new();
        for id in stream_ids {
            if let Some(stream) = self.state.streams.get(&id).await.ok().flatten() {
                streams.push(stream);
            }
        }
        streams
    }

    async fn earned_amount(&self, stream_id: u64) -> String {
        // Note: Earned amount calculation requires current time from the blockchain
        // For accurate calculation, use the contract's withdraw operation
        // This query returns 0 as a placeholder - frontend should calculate based on stream data
        if let Some(_stream) = self.state.streams.get(&stream_id).await.ok().flatten() {
            "0".to_string()
        } else {
            "0".to_string()
        }
    }

    async fn all_streams(&self) -> Vec<Stream> {
        let mut streams = Vec::new();
        let stream_count = *self.state.next_stream_id.get();

        for id in 1..stream_count {
            if let Some(stream) = self.state.streams.get(&id).await.ok().flatten() {
                streams.push(stream);
            }
        }

        streams
    }
}
