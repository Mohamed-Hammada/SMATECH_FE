import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { Role, User } from 'src/app/models/all.model';
import { RulesService } from 'src/app/services/rules.service';
import { UserServiceService } from 'src/app/services/user-service.service';



@Component({
  selector: 'app-create-update-user',
  templateUrl: './create-update-user.component.html',
  styleUrls: ['./create-update-user.component.css']
})
export class CreateUserComponent implements OnInit {

  userForm!: FormGroup;
  roles: Role[] = [];

  constructor(public dialogRef: MatDialogRef<CreateUserComponent>,
    private notificationService: NotificationService,private fb: FormBuilder
    , private userService: UserServiceService,private snackBar: MatSnackBar,private rolesService: RulesService) {

  }

  ngOnInit(): void {

}

  loadRoles(): void {
    this.rolesService.getRoles().subscribe(
      data => {
        this.roles = data;
      }
    );
  }

  get phones() {
    return (this.userForm.get('phones') as FormArray);
  }

  get rolesFormArray() {
    return (this.userForm.get('roles') as FormArray);
  }

  addPhone(): void {
    this.phones.push(this.fb.control(''));
  }

  addRole(): void {
    this.rolesFormArray.push(this.fb.group({
      id: [-1],
      name: ['', Validators.required],
    }));
  }

  onFormSubmit() {
    if (!this.userForm.valid) {
      this.snackBar.open('Form is not valid. Please check the errors.', 'Dismiss', {
        duration: 5000, // Adjust as needed
        panelClass: ['error-snackbar'], // Define your CSS class for styling
      });
      return
    }
    const user: User = this.userForm.value;
    console.log(user);
    this.userService.createUser(user).subscribe(
      (data) => {
        console.log(data)
        this.notificationService.success('Saved Successfully');

        // @TODO show errors if it's exists
        // this.notificationService.warn(data.errorMessage);

        this.onClose();
      },
      error => {
        console.log(error)
        this.notificationService.warn(error.message);
        // Handle error
      }
    );
  }

  onClose() {
    this.userForm.reset();
    this.dialogRef.close();
  }
}
