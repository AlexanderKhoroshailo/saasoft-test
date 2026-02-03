import { defineStore } from 'pinia';
import type { Account } from '@/types/account';

const STORAGE_KEY = 'accounts';

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),

  actions: {
    load(): void {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) this.accounts = JSON.parse(data);
    },

    save(): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accounts));
    },

    addAccount(): void {
      this.accounts.push({
        id: crypto.randomUUID(),
        labels: [],
        type: null,
        login: '',
        password: null,
        errors: { login: false, password: false, type: false },
      });
      this.save();
    },

    updateAccount(account: Account): void {
      const i = this.accounts.findIndex(a => a.id === account.id);

      if (i !== -1) {
        this.accounts[i] = account;
        this.save();
      }
    },

    removeAccount(id: string): void {
      this.accounts = this.accounts.filter(a => a.id !== id);
      this.save();
    },

    removeAllAccounts(): void {
      this.accounts = [];
      this.save();
    },
  },
});
