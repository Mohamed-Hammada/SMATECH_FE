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

export enum CardState {
  ENTERED,
  PRICE_OFFER,
  REJECTED_OFFER,
  UNDER_REPAIR,
  READY,
  WAIT_SPARE_PARTS,
  REJECTED_TECH,
  UNDER_TEST,
  OK_WORKING_FINE,
  OUT_OF_GUARANTEE,
  RETURN_HAVE_ISSUE
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
  action_needed: string = '';
  card_status_life_cycle: CardStatusLifeCycle = CardStatusLifeCycle.PENDING_OFFER_SETUP;
  note: string = '';
  needed_components: Components[] = [];
  assign_to: User = new User();
  logged_in_user: User = new User();
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export enum CardStatusLifeCycle {
  PENDING_OFFER_SETUP,
  OFFER_PRICE,
  REJECT_OFFER,
  UNDER_REPAIR_PENDING_ASSIGNMENT,
  UNDER_REPAIR,
  READY_FOR_DELIVERY,
  WAITING_SPARE_PARTS,
  TECHNICALLY_REJECTED,
  DELIVERY_PENDING,
  UNDER_TEST,
  RETURN_NEEDS_FIX,
  OUT_OF_WARRANTY,
  UNDER_WARRANTY_PERIOD,
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
  card_state: CardState = CardState.ENTERED;
  component_image: string = '';
  component_image_file_name: string = '';
  no_of_card_pieces:number = 0;
  logged_in_user: User = new User();
  deliver_card_user: User = new User();
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}
