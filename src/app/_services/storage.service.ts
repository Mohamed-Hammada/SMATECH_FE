import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

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
