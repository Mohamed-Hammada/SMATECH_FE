export class Company {
  id: number = -1;
  name: string = '';
  area: string = '';
  phones: string[] = [];
  customer_name: string = '';
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export class Components {
  id: number = -1;
  name: string = '';
  description: string = '';
  current_exist_quantity: number = 0;
  last_price_of_unit: number = 0;
  component_image: string = '';
  component_image_file_name: string = '';
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export class ComponentTransaction {
  id: number = -1;
  component: Components = new Components();
  transaction_date: string = ''; // Use appropriate date format
  transaction_type: TransactionType = TransactionType.ADD;
  quantity: number = 0;
  price_unit: number = 0;
  component_image: string = '';
  component_image_file_name: string = '';
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export enum TransactionType {
  ADD = 'ADD',
  USE = 'USE',
  RETURN = 'RETURN'
}

export class Role {
  id: number = -1;
  name: string = '';
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export class User {
  id: number = -1;
  email: string = '';
  username: string = '';
  phones: string[] = [];
  password: string = '';
  type: string = '';
  enabled: boolean = true;
  token_expired: boolean = false;
  roles: Role[] = [];
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}


export class UserRepairAction {
  id: number = -1;
  user: User = new User();
  card: Card = new Card();
  note: string = '';
  needed_components: Components[] = [];
  assign_to: User = new User();
  logged_in_user: User = new User();
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
  suggestedOfferRepairCost: number = -1;
  department: Department = Department.ACCOUNT;
  selectedStatus: OfferStatus = OfferStatus.WAITING_RESPONSE;
  amountPaid: number = -1;
  repairCost: number = -1;
  additionalAmountPaid: number = -1;
}

export enum CardStatus{
  PENDING_OFFER_SETUP = 'PENDING_OFFER_SETUP',
  OFFER_PRICE = 'OFFER_PRICE',
  REJECT_OFFER = 'REJECT_OFFER',
  UNDER_REPAIR_PENDING_ASSIGNMENT = 'UNDER_REPAIR_PENDING_ASSIGNMENT',
  UNDER_REPAIR = 'UNDER_REPAIR',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  WAITING_SPARE_PARTS = 'WAITING_SPARE_PARTS',
  TECHNICALLY_REJECTED = 'TECHNICALLY_REJECTED',
  DELIVERY_PENDING = 'DELIVERY_PENDING',
  UNDER_TEST = 'UNDER_TEST',
  RETURN_NEEDS_FIX = 'RETURN_NEEDS_FIX',
  OUT_OF_WARRANTY = 'OUT_OF_WARRANTY',
  UNDER_WARRANTY_PERIOD = 'UNDER_WARRANTY_PERIOD',
}

export enum OfferStatus{
  WAITING_RESPONSE='WAITING_RESPONSE',
  ACCEPT='ACCEPT',
  REJECT='REJECT'
}

export enum Department{
    ACCOUNT='ACCOUNT',
    REPAIR='REPAIR'
}
export class Card {
  id: number = -1;
  serial_no: string = ''; // You can set the appropriate default value here
  issue_description: string = '';
  company: Company = new Company();
  important_components_of_card: Components[] = [];
  suggested_offer_repair_cost: number = 0;
  repair_cost: number = 0;
  amount_paid: number = 0;
  user_actions: UserRepairAction[] = [];
  card_state: CardStatus = CardStatus.PENDING_OFFER_SETUP;
  component_image: string = '';
  component_image_file_name: string = '';
  no_of_card_pieces:number = 0;
  logged_in_user: User = new User();
  deliver_card_user: User = new User();
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}
