import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { Components, OfferStatus, TransactionType, User } from 'src/app/models/all.model';

import { debounceTime, distinctUntilChanged,catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { UserRepairActionService } from 'src/app/services/user-repair-action.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-create-update-card-offer-state',
  templateUrl: './create-update-card-offer-state.component.html',
  styleUrls: ['./create-update-card-offer-state.component.css']
})
export class CreateUpdateCardOfferStateComponent {
  form: FormGroup;
  transactionTypes = Object.values(TransactionType);
  filteredCompanies!: Observable<any[]>;
  filteredAssignUsers!: Observable<any[]>;

  statuses = Object.values(OfferStatus);

  isSuggestedOfferAccepted: boolean = false;

  fileName: string = '';
  constructor(
    public dialogRef: MatDialogRef<CreateUpdateCardOfferStateComponent>,
    private notificationService: NotificationService,
    private service: UserRepairActionService,
    private userService: UserServiceService,
    private snackBar: MatSnackBar
  ) {

    this.form = this.service.form;
    this.setupAssignUsers();
  }
  ngOnInit(): void {
    const offer_status = this.service.form.controls?.['offer_status'];
    if (offer_status?.value) {
      if (offer_status.value === OfferStatus.ACCEPT) {
        this.isSuggestedOfferAccepted = true
      }
    }

    this.form.get('offer_status')?.valueChanges.subscribe(value => {
      console.log('New status selected: ', value);
      if (value === OfferStatus.ACCEPT) {
        this.isSuggestedOfferAccepted = true
      }else{
        this.isSuggestedOfferAccepted = false
      }
    });
    const assignedUsersServiceControl =  this.service.form.controls?.['assign_to'];
    if(assignedUsersServiceControl?.value){
      this.filteredAssignUsers = of([assignedUsersServiceControl?.value])
    }

    this.setupAssignUsers();
  }


  setupAssignUsers(): void {
    // debugger
    this.filteredAssignUsers = this.form.controls?.['assign_to'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterAssignUser(value))
    );
  }

  private filterAssignUser(name: string): Observable<User[]> {
    // debugger
    console.log("Filtering for: ", name);
    return this.userService.searchUsers(name).pipe(
      map(users => users),
      catchError(error => {
        console.error('Error while filtering assign users:', error);
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

    this.service.updateOfferState(this.form.value).subscribe(
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
    return component?.name ?? '';
  }


  displayFnAssignUser(user?: User): string{
    // debugger
    return user?.username ?? '';
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
