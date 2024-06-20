export interface ICustomersState {
  data: ICustomer[];
  focusedCustomer: ICustomer;
  filter: string;
}

interface ICustomer {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  created_at: string;
  registeredUsers_id: string;
  filter: string;
}
