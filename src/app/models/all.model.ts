

export class Company {
  id: number = -1;
  name: string = '';
  area: string = '';
}

export class Component {
  id: number = -1;
  name: string = '';
  description: string = '';
  currentExistQuantity: number = 0;
  lastPriceOfUnit: number = 0;
  componentImage: string = '';
  transactions: ComponentTransaction[] = [];
}

export class ComponentTransaction {
  id: number = -1;
  component: Component = new Component();
  transactionDate: string = ''; // Use appropriate date format
  transactionType: string = '';
  quantity: number = 0;
  priceUnit: number = 0;
}


export class Role {
  id: number = -1;
  name: string = '';
}

export class User {
  id: number = -1;
  email: string = '';
  username: string = '';
  phones: string[] = [];
  password: string = '';
  type: string = '';
  enabled: boolean = true;
  tokenExpired: boolean = false;
  roles: Role[] = [];
}

export class UserRepairAction {
  id: number = -1;
  user: User = new User();
  card: Card = new Card();
  actionNeeded: string = '';
  cardStatusLifeCycle: string = '';
  note: string = '';
  neededComponents: Component[] = [];
  assignTo: User = new User();
}


export class Card {
  id: number = -1;
  serialNo: string = ''; // You can set the appropriate default value here
  issueDescription: string = '';
  company: Company = new Company();
  componentsOfCard: Component[] = [];
  repairCost: number = 0;
  userActions: UserRepairAction[] = [];
  loggedInUser: User = new User();
}
