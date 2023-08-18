import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuardService } from './services/auth-guard.service';
import { CreateUserComponent } from './pages/users/creat-update-user/create-update-user.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';


const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'login', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'users', component: UsersComponent },
  { path: 'users', component: UsersComponent , canActivate: [AuthGuardService],data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'users/create', component: CreateUserComponent  , canActivate: [AuthGuardService],data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'users/edit/:id', component: CreateUserComponent  , canActivate: [AuthGuardService],data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'pageNotFound', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  // imports: [RouterModule.forRoot(routes, { useHash: true })],
  // exports: [RouterModule],
  // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
export const routingComponents = [  LoginComponent,WelcomeComponent, UsersComponent,

  CreateUserComponent,
  PageNotFoundComponent ]
