import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { Components, ERole, TechStatus, TransactionType, User } from 'src/app/models/all.model';

import { debounceTime, distinctUntilChanged,catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { UserRepairActionService } from 'src/app/services/user-repair-action.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { ComponentService } from 'src/app/services/components.service';
@Component({
  selector: 'app-create-update-tech-state',
  templateUrl: './create-update-tech-state.component.html',
  styleUrls: ['./create-update-tech-state.component.css']
})
export class CreateUpdateTechStateComponent {
  form: FormGroup;
  transactionTypes = Object.values(TransactionType);
  filteredCompanies!: Observable<any[]>;
  filteredAssignUsers!: Observable<any[]>;
  hide_show_assign_to:boolean=false;
  statuses = Object.values(TechStatus);

  isAcceptedTechnical: boolean = false;
  filteredComponents!: Observable<any[]>;
  fileName: string = '';


  componentsFormInput: FormGroup;
  inputsOfComponentsForm: any[] = [];
  initialData = [
    { autocomplete: 'Initial 1', number: 123 },
    { autocomplete: 'Initial 2', number: 456 },
  ];


  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateUpdateTechStateComponent>,
    private notificationService: NotificationService,
    private service: UserRepairActionService,
    private fb: FormBuilder,
    public storageService: StorageService,
    private userService: UserServiceService,
    private componentService: ComponentService,
    private snackBar: MatSnackBar
  ) {
    this.componentsFormInput = this.formBuilder.group({});
    this.form = this.service.form;
    this.setupAssignUsers();
    this.setupProductNameField();
    if (this.storageService.hasRole(ERole.ROLE_ADMIN) ||
    this.storageService.hasRole(ERole.ROLE_REPAIR_TECHNICIAN_HEAD)) {
    this.hide_show_assign_to = true;
  }
  }
  ngOnInit(): void {
    this.componentsFormInput = this.formBuilder.group({});

    const tech_status = this.service.form.controls?.['tech_status'];
    if (tech_status?.value) {
      if (tech_status.value === TechStatus.ACCEPT) {
        this.isAcceptedTechnical = true
      }
    }

    this.form.get('tech_status')?.valueChanges.subscribe(value => {
      console.log('New status selected: ', value);
      if (value === TechStatus.ACCEPT) {
        this.isAcceptedTechnical = true
      }else{
        this.isAcceptedTechnical = false
      }
    });
    const assignedUsersServiceControl =  this.service.form.controls?.['assign_to'];
    if(assignedUsersServiceControl?.value){
      this.filteredAssignUsers = of([assignedUsersServiceControl?.value])
    }

    this.setupAssignUsers();
    this.populateForm();
    this.loadInitialData();
  }

  loadInitialData() {
    this.initialData.forEach((data, index) => {
      const formGroupName = `inputGroup${index}`;
      this.inputsOfComponentsForm.push(formGroupName);

      this.componentsFormInput.addControl(formGroupName, this.formBuilder.group({
        autocomplete: [data.autocomplete, Validators.required],
        number: [data.number, Validators.pattern(/^\d+$/)],
      }));
    });
  }
  
  addInput() {
    const index = this.inputsOfComponentsForm.length;
    const formGroupName = `inputGroup${index}`;
    this.inputsOfComponentsForm.push(formGroupName);
  
    this.componentsFormInput.addControl(formGroupName, this.formBuilder.group({
      autocomplete: ['', Validators.required],
      number: [1, [Validators.pattern(/^\d+$/) , Validators.min(1)]],
    }));
  }
  

  removeInput(index: number) {
    const formGroupName = this.inputsOfComponentsForm[index];
    this.inputsOfComponentsForm.splice(index, 1);
    this.componentsFormInput.removeControl(formGroupName);
  }

  private populateForm(): void {
    const needed_components = this.userService.form.get("needed_components")?.value;
    // debugger
    this.form.setControl('needed_components', this.fb.array([]));

    if (needed_components && needed_components.length > 0) {
      this.addNeededComponentsList(needed_components);
    } else {
      this.addNeededComponent();
    }
  }

  addNeededComponentsList(needed_components: Components[]): void {
    for (const needed_component of needed_components) {
      this.needed_components.push(this.fb.control(needed_component));
    }
  }

  addNeededComponent(): void {
    this.needed_components.push(this.fb.control(''));
  }

  removeNeededComponent(index: number): void {
    this.needed_components.removeAt(index);
  }
  get needed_components(): FormArray {
    return this.form.get('needed_components') as FormArray;
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

    this.service.updateTechState(this.form.value).subscribe(
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
  
  setupProductNameField(): void {
    this.filteredComponents = this.form.controls?.['needed_components'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterComponents(value))
    );
  }
  onClose(): void {
    this.form.reset();
    this.dialogRef.close();
  }

}
