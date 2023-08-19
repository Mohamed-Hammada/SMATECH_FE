import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { Components, TransactionType } from 'src/app/models/all.model';
import { ComponentTransactionService } from 'src/app/services/component-transactions.service';


import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ComponentService } from 'src/app/services/components.service';

@Component({
  selector: 'app-create-update-component-transaction',
  templateUrl: './create-update-component-transaction.component.html',
  styleUrls: ['./create-update-component-transaction.component.css']
})
export class CreateUpdateComponentTransactionComponent {
  form: FormGroup;
  transactionTypes = Object.values(TransactionType);
  productNameCtrl = new FormControl(null, Validators.required);
  filteredComponents!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateComponentTransactionComponent>,
    private notificationService: NotificationService,
    private service: ComponentTransactionService,
    private componentService: ComponentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.service.form;
    this.form.addControl('productName', this.productNameCtrl);
    this.setupProductNameField();

  }

  setupProductNameField(): void {
    this.filteredComponents = this.productNameCtrl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.['name']),
      map(name => name ? this.filterComponents(name) : [])
    );
  }

  private filterComponents(name: string): any[] {
    // Call the service method to get the filtered components.
    this.componentService.searchComponents(name).subscribe(
      components => {
        return components;
      },
      error => {
        // Handle the error appropriately.
        console.error('Error while filtering components:', error);
        return [];
      }
    );
    return [];
  }
  onFormSubmit(): void {

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

    this.service.createComponentTransaction(this.form.value).subscribe(
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
    return component ? component.name : '';
  }

  onClose(): void {
    this.form.reset();
    this.dialogRef.close();
  }
}
