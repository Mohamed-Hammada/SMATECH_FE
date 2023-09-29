import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    const requiredRoles = route.data['requiredRoles']; // Note the plural 'requiredRoles'
  
    if (!Array.isArray(requiredRoles)) {
      console.error("requiredRoles should be an array.");
      return false;
    }
  
    if (this.storageService.isLoggedIn()) {
      const userRoles = this.storageService.getAllRoles();
  
      // Check if the user has at least one of the required roles
      if (requiredRoles.some(role => userRoles.map(e=>e.name).includes(role))) {
        return true;
      } else {
        console.error("Unauthorized");
        this.router.navigate(['unauthorized']);
        return false;
      }
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
  

}
