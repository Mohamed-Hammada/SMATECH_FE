import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { ComponentService } from 'src/app/services/components.service';


@Component({
  selector: 'app-create-update-components',
  templateUrl: './create-update-components.component.html',
  styleUrls: ['./create-update-components.component.css']
})
export class CreateUpdateComponentsComponent {
  form!: FormGroup;
  fileName: string = '';
  constructor(
    public dialogRef: MatDialogRef<CreateUpdateComponentsComponent>,
    private notificationService: NotificationService,
    private service: ComponentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.service.form;
  }

  onFormSubmit(): void {
    if (!this.form.valid) {
      this.snackBar.open('Form is not valid. Please check the errors.', 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }
    debugger
    this.service.createComponent(this.form.value).subscribe(
      (data) => {
        this.notificationService.success('Saved Successfully');
        this.onClose();
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  chooseFile(event: Event, fileInput: any) {
    event.preventDefault();
    fileInput.click();
  }


onFileChange(event: any) {
  debugger
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
