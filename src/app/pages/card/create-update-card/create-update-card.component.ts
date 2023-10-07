import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { Company, Components, TransactionType, User } from 'src/app/models/all.model';
import { ComponentTransactionService } from 'src/app/services/component-transactions.service';
import { debounceTime, distinctUntilChanged,catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { ComponentService } from 'src/app/services/components.service';
import { CardService } from 'src/app/services/card.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-create-update-card',
  templateUrl: './create-update-card.component.html',
  styleUrls: ['./create-update-card.component.css']
})
export class CreateUpdateCardComponent implements OnInit {
  form: FormGroup;
  transactionTypes = Object.values(TransactionType);
  // productNameCtrl = new FormControl('', Validators.required);
  // filteredComponents!: Observable<any[]>;
  filteredCompanies!: Observable<any[]>;
  filteredDeliveredUsers!: Observable<any[]>;

  fileName: string = '';
  constructor(
    public dialogRef: MatDialogRef<CreateUpdateCardComponent>,
    private notificationService: NotificationService,
    private service: CardService,
    private componentService: ComponentService,
    private companyService: CompanyService,
    private userService: UserServiceService,
    private snackBar: MatSnackBar
  ) {
   
    // this.form.addControl('productName', this.productNameCtrl);
    this.form = this.service.form;
    // this.setupProductNameField();
    this.setupCompaniesField();
    this.setupDeliveredUsers();
    // debugger
  }
  ngOnInit(): void {
    // debugger
  //  const componentServiceControl =  this.service.form.controls?.['important_components_of_card'];
  //   if(componentServiceControl?.value){
  //     this.filteredComponents = of([componentServiceControl?.value])
  //   }

    const companyServiceControl =  this.service.form.controls?.['company'];
    if(companyServiceControl?.value){
      this.filteredCompanies = of([companyServiceControl?.value])
      this.setupCompaniesField();
    }

    const deliveredUsersServiceControl =  this.service.form.controls?.['deliver_card_user'];
    if(deliveredUsersServiceControl?.value){
      this.filteredDeliveredUsers = of([deliveredUsersServiceControl?.value])
      this.setupDeliveredUsers();
    }

    const component_image_file_name =  this.service.form.controls?.['component_image_file_name'];
    if(component_image_file_name?.value){
      this.fileName = component_image_file_name.value
    }
  }

  
  setupDeliveredUsers(): void {
    // debugger
    this.filteredDeliveredUsers = this.form.controls?.['deliver_card_user'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterDeliverUser(value))
    );
  }

  setupCompaniesField(): void {
    // debugger
    this.filteredCompanies = this.form.controls?.['company'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterCompanies(value))
    );
  }


  // setupProductNameField(): void {
  //   this.filteredComponents = this.form.controls?.['important_components_of_card'].valueChanges.pipe(
  //     startWith(''),
  //     debounceTime(300),
  //     distinctUntilChanged(),
  //     switchMap(value => this.filterComponents(value))
  //   );
  // }

  private filterDeliverUser(name: string): Observable<User[]> {
    // debugger
    console.log("Filtering for: ", name);
    return this.userService.searchUsers(name).pipe(
      map(users => users),
      catchError(error => {
        console.error('Error while filtering deliver users:', error);
        return of([]); // returns an empty array on error
      })
    );
  }

  
  private filterCompanies(name: string): Observable<Company[]> {
    // debugger
    console.log("Filtering for: ", name);
    return this.companyService.searchCompanies(name).pipe(
      map(companies => companies),
      catchError(error => {
        console.error('Error while filtering companies:', error);
        return of([]); // returns an empty array on error
      })
    );
  }

  private filterComponents(name: string): Observable<Components[]> {
    // debugger
    console.log("Filtering for: ", name);
    return this.componentService.searchComponents(name).pipe(
      map(components => components),
      catchError(error => {
        console.error('Error while filtering components:', error);
        return of([]); // returns an empty array on error
      })
    );
  }

  onFormSubmit(): void {
    // debugger
    if (this.form.valid) {
      console.log('Form Submitted!');
      // ... handle the submit action ...
    } else {
      console.log('Form is not valid');
      this.logValidationErrors(this.form);
    }

    if (!this.form.valid) {
      this.snackBar.open('Form is not valid. Please check the errors.', 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.service.createCard(this.form.value).subscribe(
      (data) => {
        this.notificationService.success('Saved Successfully');
        this.onClose();
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }
  logValidationErrors(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.logValidationErrors(control);
      } else {
        if (control?.errors != null) {
          Object.keys(control?.errors).forEach(messageKey => {
            console.log('Control', key, 'has error', messageKey, 'with', control?.errors?.[messageKey]);
          });
        }
      }
    });
  }

  displayFn(component?: Components): string {
    // debugger
    return  component?.name ?? '';
  }

  
  displayFnDeliverUser(user?: User): string {
    // debugger
    return  user?.username ?? '';
  }

  displayFnAssignUser(user?: User): string {
    // debugger
    return  user?.username ?? '';
  }

  chooseFile(event: Event, fileInput: any) {
    event.preventDefault();
    fileInput.click();
  }
  
  
  onFileChange(event: any) {
  // debugger
  const reader = new FileReader();

  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    this.fileName = file.name;


    // Set the file name in the form control
    this.form.get('component_image_file_name')?.setValue(this.fileName);

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result as string;
      this.form.get('component_image')?.setValue(base64String);
      // console.log('Form Control Value:', this.form.get('component_image')?.value); // <-- Add this line
    };
  }
}
  onClose(): void {
    this.form.reset();
    this.dialogRef.close();
  }

}