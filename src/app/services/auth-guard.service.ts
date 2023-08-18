import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { UserServiceService } from './user-service.service';
import { Observable } from 'rxjs';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):  Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    const requiredRole = route.data['requiredRole'];

    if (this.storageService.isLoggedIn()) {
      if (this.storageService.hasRole(requiredRole)) {
        return true;
      } else {
        console.error("unauthorized");
        this.router.navigate(['unauthorized']);
        return false;
      }
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
