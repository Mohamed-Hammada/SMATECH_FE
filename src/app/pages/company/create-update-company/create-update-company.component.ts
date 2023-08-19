import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    private snackBar: MatSnackBar
  ) {
    this.form = this.service.form;
  }

  ngOnInit(): void {

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

  onClose(): void {
    this.form.reset();
    this.dialogRef.close();
  }
}
