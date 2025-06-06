export type WalletTypes = {
  id: string;
  name: string;
  active_period: string; 
  tags: string[];
  is_deleted: boolean;
  creation_timestamp: string; 
  destination_contacts: DestinationContact[];
  available_tokens: number | null;
}

export type DestinationContact = {
  name: string;
  mpesa_phone_numbers: string[]; 
}
