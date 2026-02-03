
export type AccountType = 'LDAP' | 'LOCAL';

export interface LabelItem {
  text: string;
}

export interface Account {
  id: string;
  labels: LabelItem[];
  type: AccountType | null;
  login: string;
  password: string | null;
  errors: {
    login: boolean;
    password: boolean;
    type: boolean;
  };
}
