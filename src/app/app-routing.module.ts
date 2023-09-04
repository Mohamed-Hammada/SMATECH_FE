import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuardService } from './_services/auth-guard.service';
import { CreateUserComponent } from './pages/users/creat-update-user/create-update-user.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CompaniesComponent } from './pages/company/company.component';
import { CreateUpdateCompanyComponent } from './pages/company/create-update-company/create-update-company.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ComponentsComponent } from './pages/components/components.component';
import { ComponentsTransactionsComponent } from './pages/components-transactions/components-transactions.component';
import { CardComponent } from './pages/card/card.component';


const routes: Routes = [
  { path: '', redirectTo: 'card', pathMatch: 'full' },
  { path: 'login', redirectTo: 'card', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'card', component: CardComponent,canActivate: [AuthGuardService], data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService], data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'companies', component: CompaniesComponent, canActivate: [AuthGuardService], data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'components', component: ComponentsComponent, canActivate: [AuthGuardService], data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'components-transaction', component: ComponentsTransactionsComponent, canActivate: [AuthGuardService], data: { requiredRole: 'ROLE_ADMIN' } },
  { path: 'pageNotFound', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
  // imports: [RouterModule.forRoot(routes)],
  // exports: [RouterModule],
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, WelcomeComponent, UsersComponent,

  CreateUserComponent,
  CreateUpdateCompanyComponent,
  PageNotFoundComponent]
