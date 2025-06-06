
export type CreateWalletPayload = {
  name: string;
  active_period: string; 
  tags: string[]; 
  dest_mpesa_phone_numbers: string[]; 
};


export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  hash?: string;
}

export type DepositPayload = {
  token:string;
  amount:string;
  phone_number:string;
}

