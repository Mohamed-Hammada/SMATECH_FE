import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Role, User } from 'src/app/models/all.model';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-create-update-user',
  templateUrl: './create-update-user.component.html',
  styleUrls: ['./create-update-user.component.css']
})
export class CreateUserComponent implements OnInit {

  userForm!: FormGroup;
  roles: Role[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private userService: UserServiceService,
    private snackBar: MatSnackBar,
    private storageService: StorageService
  ) {
    this.roles = this.storageService.getAllRoles();
    this.userForm = this.initializeUserForm();
  }

  ngOnInit(): void {
    const initialRoles = this.storageService?.getUser()?.roles || [];
    this.populateForm(initialRoles);
  }

  private initializeUserForm(): FormGroup {
    console.log("roles"  , this.roles);
    return this.fb.group({
      id: [],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      phones: this.fb.array(['']),
      roles: this.roles,
      type: ['', Validators.required],
      enabled: ['', Validators.required],
    });
  }

  private populateForm(initialRoles: string[]): void {
    this.userForm.setControl('phones', this.fb.array([]));
    const phones = this.userForm.get("phones")?.value;

    if (phones && phones.length > 0) {
      console.log(this.phones);
      this.addPhoneList(phones);
    } else {
      this.addPhone();
    }

    this.userForm.setControl('roles', this.fb.control(initialRoles));
  }

  get phones(): FormArray {
    return this.userForm.get('phones') as FormArray;
  }

  get rolesFormArray(): FormArray {
    return this.userForm.get('roles') as FormArray;
  }

  addPhoneList(phones: string[]): void {
    for (const phone of phones) {
      this.phones.push(this.fb.control(phone));
    }
  }

  addPhone(): void {
    this.phones.push(this.fb.control(''));
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  addRole(): void {
    this.rolesFormArray.push(this.fb.group({
      id: [-1],
      name: ['', Validators.required],
    }));
  }

  onFormSubmit(): void {
    if (!this.userForm.valid) {
      this.snackBar.open('Form is not valid. Please check the errors.', 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const user: User = this.userForm.value;
    this.userService.createUser(user).subscribe(
      (data) => {
        this.notificationService.success('Saved Successfully');
        this.onClose();
      },
      error => {
        this.notificationService.warn(error.message);
      }
    );
  }

  transformRoleName(roleName: string): string {
    return roleName.replace('ROLE_', '');
  }

  onClose(): void {
    this.userForm.reset();
    this.dialogRef.close();
  }
}
