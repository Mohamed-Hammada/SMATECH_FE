import { Injectable } from '@angular/core';
import { Role } from '../models/all.model';

const USER_KEY = 'auth-user';
const ROLES_KEY = 'all-roles';

export interface User {
  roles?: string[];
  // other properties you expect on the user object
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  saveAllRoles(roles:Role[]): void {
    window.sessionStorage.removeItem(ROLES_KEY);
    window.sessionStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  }

  getAllRoles(): Role[] | [] {
    const user = window.sessionStorage.getItem(ROLES_KEY);
    return user ? JSON.parse(user) : [];
  }

  getUser(): User | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    const user = this.getUser();
    return user !== null;
  }

  getRoles(): string[] {
    const user = this.getUser();
    return user?.roles ?? [];
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

}
