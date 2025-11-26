use async_graphql::SimpleObject;
use linera_sdk::{
    linera_base_types::{AccountOwner, Amount},
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
};
use token::DailyBonus;

#[derive(RootView, SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct TokenState {
    pub accounts: MapView<AccountOwner, Amount>,
    pub daily_bonuses: MapView<AccountOwner, DailyBonus>,
    pub total_supply: RegisterView<Amount>,
}

impl TokenState {
    pub async fn balance(&self, owner: &AccountOwner) -> Amount {
        self.accounts
            .get(owner)
            .await
            .unwrap()
            .unwrap_or(Amount::ZERO)
    }

    pub async fn credit(&mut self, owner: AccountOwner, amount: Amount) {
        let mut balance = self.balance(&owner).await;
        balance = balance.saturating_add(amount);
        self.accounts.insert(&owner, balance).unwrap();
    }

    pub async fn debit(&mut self, owner: AccountOwner, amount: Amount) -> Result<(), String> {
        let balance = self.balance(&owner).await;
        if balance < amount {
            return Err("Insufficient balance".to_string());
        }
        let new_balance = balance.saturating_sub(amount);
        self.accounts.insert(&owner, new_balance).unwrap();
        Ok(())
    }
}
