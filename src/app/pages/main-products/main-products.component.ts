import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserServiceService } from 'src/app/services/user-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-main-products',
  templateUrl: './main-products.component.html',
  styleUrls: ['./main-products.component.css']
})
export class MainProductsComponent {
  constructor(
    private breakpointObserver: BreakpointObserver,
    public storageService: StorageService,
    public userService: UserServiceService
  ) {}
}
