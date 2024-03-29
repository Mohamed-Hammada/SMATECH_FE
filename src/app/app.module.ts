import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';



import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialModule } from './material/material.module';
import { DatePipe } from '@angular/common';


import { AppRoutingModule , routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MenuComponent } from './pages/menu/menu.component';
import { MatConfirmDialogComponent } from './pages/helper/mat-confirm-dialog/mat-confirm-dialog.component';
import { UsersComponent } from './pages/users/users.component';
import { CreateUserComponent } from './pages/users/creat-update-user/create-update-user.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor.service';
import { CustomToolbarComponent } from './pages/helper/custom-toolbar/custom-toolbar.component';
import { CompaniesComponent } from './pages/company/company.component';
import { CreateUpdateCompanyComponent } from './pages/company/create-update-company/create-update-company.component';
import { ComponentsComponent } from './pages/components/components.component';
import { CreateUpdateComponentsComponent } from './pages/components/create-update-components/create-update-components.component';
import { ImageDialogComponent } from './_helpers/image-dialog/image-dialog.component';
import { ComponentsTransactionsComponent } from './pages/components-transactions/components-transactions.component';
import { CreateUpdateComponentTransactionComponent } from './pages/components-transactions/create-update-component-transaction/create-update-component-transaction.component';
import { CardComponent } from './pages/card/card.component';
import { CreateUpdateCardComponent } from './pages/card/create-update-card/create-update-card.component';
import { OfferStateComponent } from './pages/offer-state/offer-state.component';
import { CreateUpdateCardOfferStateComponent } from './pages/offer-state/create-update-card-offer-state/create-update-card-offer-state.component';
import { TechStateComponent } from './pages/tech-state/tech-state.component';
import { CreateUpdateTechStateComponent } from './pages/tech-state/create-update-tech-state/create-update-tech-state.component';
import { CardStatusLifeCycleMatrixRolesComponent } from './pages/card-status-life-cycle-matrix-roles/card-status-life-cycle-matrix-roles.component';
import { CreateUpdateCardStatusLifeCycleMatrixRolesComponent } from './pages/card-status-life-cycle-matrix-roles/create-update-card-status-life-cycle-matrix-roles/create-update-card-status-life-cycle-matrix-roles.component';
import { MarketingManagerComponent } from './pages/marketing-manager/marketing-manager.component';
import { CreateUpdateMarketingManagerComponent } from './pages/marketing-manager/create-update-marketing-manager/create-update-marketing-manager.component';
import { MainProductsComponent } from './pages/main-products/main-products.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TechStateCardsComponent } from './pages/tech-state-cards/tech-state-cards.component';
import { TechStateCardDetailsComponent } from './pages/tech-state-cards/tech-state-card-details/tech-state-card-details.component';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    routingComponents,
    
    MatConfirmDialogComponent,
    UsersComponent,
    CreateUserComponent,
    WelcomeComponent,
    LoginComponent,
    CustomToolbarComponent,
    CompaniesComponent,
    CreateUpdateCompanyComponent,
    ComponentsComponent,
    CreateUpdateComponentsComponent,
    ImageDialogComponent,
    ComponentsTransactionsComponent,
    CreateUpdateComponentTransactionComponent,
    CardComponent,
    CreateUpdateCardComponent,
    OfferStateComponent,
    CreateUpdateCardOfferStateComponent,
    TechStateComponent,
    CreateUpdateTechStateComponent,
    CardStatusLifeCycleMatrixRolesComponent,
    CreateUpdateCardStatusLifeCycleMatrixRolesComponent,
    MarketingManagerComponent,
    CreateUpdateMarketingManagerComponent,
    MainProductsComponent,
    TechStateCardsComponent,
    TechStateCardDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    HttpClientModule,
    MatSortModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule,
    MatSelectModule,
    MatGridListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MaterialModule,
    MatMenuModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [DatePipe,httpInterceptorProviders],
  bootstrap: [AppComponent],
  //entryComponents: [ MatConfirmDialogComponent]
})
export class AppModule { }
