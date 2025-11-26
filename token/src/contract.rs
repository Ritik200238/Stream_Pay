#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::{Amount, WithContractAbi},
    views::{RootView, View},
    Contract, ContractRuntime,
};
use token::{DailyBonus, TokenAbi, TokenOperation, TokenResponse};

use self::state::TokenState;

pub struct TokenContract {
    state: TokenState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(TokenContract);

impl WithContractAbi for TokenContract {
    type Abi = TokenAbi;
}

impl Contract for TokenContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TokenState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TokenContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        // Initialize with some tokens for testing
        self.state.total_supply.set(Amount::from_attos(1_000_000_000));
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            TokenOperation::Balance { owner } => {
                let balance = self.state.balance(&owner).await;
                TokenResponse::Balance(balance)
            }

            TokenOperation::Transfer {
                owner,
                amount,
                target_owner,
            } => {
                // Check permission
                self.runtime
                    .check_account_permission(owner)
                    .expect("Permission denied");

                // Debit sender
                if let Err(e) = self.state.debit(owner, amount).await {
                    return TokenResponse::Error(e);
                }

                // Credit recipient
                self.state.credit(target_owner, amount).await;

                TokenResponse::Ok
            }

            TokenOperation::ClaimBonus { owner } => {
                // Check permission
                self.runtime
                    .check_account_permission(owner)
                    .expect("Permission denied");

                let current_time = self.runtime.system_time();

                // Get or create daily bonus
                let mut bonus = self
                    .state
                    .daily_bonuses
                    .get(&owner)
                    .await
                    .unwrap()
                    .unwrap_or_else(|| DailyBonus::new(Amount::from_attos(1_000_000)));

                let claimed_amount = bonus.claim(current_time);

                if claimed_amount == Amount::ZERO {
                    return TokenResponse::Error("Bonus not available yet".to_string());
                }

                // Update bonus
                self.state
                    .daily_bonuses
                    .insert(&owner, bonus)
                    .unwrap();

                // Credit account
                self.state.credit(owner, claimed_amount).await;

                TokenResponse::Balance(claimed_amount)
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
