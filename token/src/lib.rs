use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{AccountOwner, Amount, ContractAbi, ServiceAbi, Timestamp},
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct TokenAbi;

impl ContractAbi for TokenAbi {
    type Operation = TokenOperation;
    type Response = TokenResponse;
}

impl ServiceAbi for TokenAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum TokenOperation {
    /// Transfer tokens
    Transfer {
        owner: AccountOwner,
        amount: Amount,
        target_owner: AccountOwner,
    },

    /// Claim daily bonus
    ClaimBonus { owner: AccountOwner },

    /// Check balance
    Balance { owner: AccountOwner },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum TokenResponse {
    Ok,
    Balance(Amount),
    Error(String),
}

#[derive(Clone, Debug, Deserialize, Serialize, SimpleObject)]
pub struct DailyBonus {
    pub amount: Amount,
    pub last_claim: Timestamp,
}

impl DailyBonus {
    pub fn new(amount: Amount) -> Self {
        Self {
            amount,
            last_claim: Timestamp::from(0),
        }
    }

    pub fn can_claim(&self, current_time: Timestamp) -> bool {
        let elapsed = current_time.delta_since(self.last_claim).as_micros();
        elapsed >= 86_400_000_000 // 24 hours in microseconds
    }

    pub fn claim(&mut self, current_time: Timestamp) -> Amount {
        if self.can_claim(current_time) {
            self.last_claim = current_time;
            self.amount
        } else {
            Amount::ZERO
        }
    }
}
