import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-create-update-company',
  templateUrl: './create-update-company.component.html',
  styleUrls: ['./create-update-company.component.css']
})
export class CreateUpdateCompanyComponent {

  form!: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<CreateUpdateCompanyComponent>,
    private notificationService: NotificationService,
    private service: CompanyService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.service.form;
  }

  ngOnInit(): void {
    this.populateForm();
  }
  private populateForm(): void {
    const phones = this.service.form.get("phones")?.value;
    debugger
    this.form.setControl('phones', this.fb.array([]));

    if (phones && phones.length > 0) {
      console.log(this.phones);
      this.addPhoneList(phones);
    } else {
      this.addPhone();
    }
  }
  
  addPhoneList(phones: string[]): void {
    for (const phone of phones) {
      this.phones.push(this.fb.control(phone));
    }
  }

  addPhone(): void {
    this.phones.push(this.fb.control(''));
  }

  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }
  onFormSubmit(): void {
    if (!this.form.valid) {
      this.snackBar.open('Form is not valid. Please check the errors.', 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.service.createCompany(this.form.value).subscribe(
      (data) => {
        this.notificationService.success('Saved Successfully');
        this.onClose();
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }
  
  onClose(): void {
    this.form.reset();
    this.dialogRef.close();
  }
}
