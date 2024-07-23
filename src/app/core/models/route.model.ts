export class RouteData {
  title: string;
  roles: string[];
  permissions: string;

  constructor(title: string, roles: string[], permissions: string) {
    this.title = title;
    this.roles = roles;
    this.permissions = permissions;
  }
}
