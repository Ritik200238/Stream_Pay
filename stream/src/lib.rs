use async_graphql::{Request, Response, Enum, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{AccountOwner, Amount, ApplicationId, ContractAbi, ServiceAbi, Timestamp},
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct StreamAbi;

impl ContractAbi for StreamAbi {
    type Operation = StreamOperation;
    type Response = StreamResponse;
}

impl ServiceAbi for StreamAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum StreamOperation {
    CreateStream {
        recipient: AccountOwner,
        rate_per_second: String, // Amount as string for GraphQL
        duration_seconds: Option<u64>,
    },

    PauseStream {
        stream_id: u64,
    },

    ResumeStream {
        stream_id: u64,
    },

    StopStream {
        stream_id: u64,
    },

    WithdrawFromStream {
        stream_id: u64,
        amount: Option<String>, // Amount as string for GraphQL
    },

    TopUpStream {
        stream_id: u64,
        amount: String,
    },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum StreamResponse {
    Ok,
    StreamId(u64),
    Amount(Amount),
    Error(String),
}

#[derive(Clone, Debug, Deserialize, Serialize, SimpleObject)]
pub struct Stream {
    pub id: u64,
    pub sender: AccountOwner,
    pub recipient: AccountOwner,
    pub rate_per_second: Amount,
    pub start_time: Timestamp,
    pub end_time: Option<Timestamp>,
    pub paused_at: Option<Timestamp>,
    pub total_deposited: Amount,
    pub total_withdrawn: Amount,
    pub status: StreamStatus,
}

#[derive(Clone, Debug, Deserialize, Serialize, Enum, Copy, PartialEq, Eq)]
pub enum StreamStatus {
    Active,
    Paused,
    Completed,
    Stopped,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum StreamMessage {
    StreamCreated {
        stream_id: u64,
        recipient: AccountOwner,
        rate_per_second: Amount,
    },
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StreamParameters {
    pub token_app: ApplicationId<token::TokenAbi>,
}
