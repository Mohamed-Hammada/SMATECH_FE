export class Company {
  id: number = -1;
  name: string = '';
  area: string = '';
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export class Component {
  id: number = -1;
  name: string = '';
  description: string = '';
  current_exist_quantity: number = 0;
  last_price_of_unit: number = 0;
  component_image: string = '';
  transactions: ComponentTransaction[] = [];
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export class ComponentTransaction {
  id: number = -1;
  component: Component = new Component();
  transaction_date: string = ''; // Use appropriate date format
  transaction_type: string = '';
  quantity: number = 0;
  price_unit: number = 0;
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
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
  card_status_life_cycle: string = '';
  note: string = '';
  needed_components: Component[] = [];
  assign_to: User = new User();
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}

export class Card {
  id: number = -1;
  serial_no: string = ''; // You can set the appropriate default value here
  issue_description: string = '';
  company: Company = new Company();
  components_of_card: Component[] = [];
  repair_cost: number = 0;
  user_actions: UserRepairAction[] = [];
  logged_in_user: User = new User();
  created_at: string = ''; // Use appropriate date format
  updated_at: string = ''; // Use appropriate date format
}
