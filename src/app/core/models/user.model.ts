//Base
export class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

//Child
export class UserCurrent extends User {
  roles: string[];

  constructor(name: string, roles: string[]) {
    super(name);
    this.roles = roles;
  }
}
