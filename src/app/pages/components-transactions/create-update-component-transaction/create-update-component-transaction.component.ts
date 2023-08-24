import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { Components, TransactionType } from 'src/app/models/all.model';
import { ComponentTransactionService } from 'src/app/services/component-transactions.service';
import { debounceTime, distinctUntilChanged,catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { ComponentService } from 'src/app/services/components.service';

@Component({
  selector: 'app-create-update-component-transaction',
  templateUrl: './create-update-component-transaction.component.html',
  styleUrls: ['./create-update-component-transaction.component.css']
})
export class CreateUpdateComponentTransactionComponent implements OnInit {
  form: FormGroup;
  transactionTypes = Object.values(TransactionType);
  // productNameCtrl = new FormControl('', Validators.required);
  filteredComponents!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateComponentTransactionComponent>,
    private notificationService: NotificationService,
    private service: ComponentTransactionService,
    private componentService: ComponentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.service.form;
    // this.form.addControl('productName', this.productNameCtrl);
    this.setupProductNameField();

  }
  ngOnInit(): void {

  }

  setupProductNameField(): void {
    this.filteredComponents = this.form.controls?.['productName'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterComponents(value))
    );
  }




  private filterComponents(name: string): Observable<Components[]> {
    debugger
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
    debugger
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
    debugger
    return  component?.name ?? '';
  }

  onClose(): void {
    this.form.reset();
    this.dialogRef.close();
  }
}
