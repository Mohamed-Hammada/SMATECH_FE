

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { CardStatus, Role, TransactionType } from 'src/app/models/all.model';
import { CardStatusLifeCycleMatrixRolesService } from 'src/app/services/card-status-life-cycle-matrix-roles.service';
import { debounceTime, distinctUntilChanged,catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { RulesService } from 'src/app/services/rules.service';
import { CardStatusLifeCycleMatrixRolesComponent } from '../card-status-life-cycle-matrix-roles.component';

@Component({
  selector: 'app-create-update-card-status-life-cycle-matrix-roles',
  templateUrl: './create-update-card-status-life-cycle-matrix-roles.component.html',
  styleUrls: ['./create-update-card-status-life-cycle-matrix-roles.component.css']
})
export class CreateUpdateCardStatusLifeCycleMatrixRolesComponent {
  form: FormGroup;
  cardStatus = Object.values(CardStatus);
  // productNameCtrl = new FormControl('', Validators.required);
  filteredRole!: Observable<any[]>;
  fileName: string = '';
  constructor(
    public dialogRef: MatDialogRef<CardStatusLifeCycleMatrixRolesComponent>,
    private notificationService: NotificationService,
    private service: CardStatusLifeCycleMatrixRolesService,
    private rulesService: RulesService,
    private snackBar: MatSnackBar
  ) {
   
 
    this.form = this.service.form;
    this.setupRoleField();
 
  }
  ngOnInit(): void {
 
   const rulesServiceControl =  this.service.form.controls?.['role'];
    if(rulesServiceControl?.value){
      this.filteredRole = of([rulesServiceControl?.value])
      this.setupRoleField();
    }
    
  }

  setupRoleField(): void {
    this.filteredRole = this.form.controls?.['role'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterRole(value))
    );
  }




  private filterRole(name: string): Observable<Role[]> {
    // debugger
    console.log("Filtering for: ", name);
    return this.rulesService.search(name).pipe(
      map(role => role),
      catchError(error => {
        console.error('Error while filtering role:', error);
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

    this.service.createCardStatusLifeCycleMatrixRoles(this.form.value).subscribe(
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

  displayFn(component?: Role): string {
    // debugger
    return  component?.name ?? '';
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
