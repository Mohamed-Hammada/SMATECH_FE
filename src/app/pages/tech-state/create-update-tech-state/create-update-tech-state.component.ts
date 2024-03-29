import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/_helpers/notification.service';
import { Components, ERole, NeededComponent, TechStatus, TransactionType, User } from 'src/app/models/all.model';

import { debounceTime, distinctUntilChanged, catchError, map, startWith, switchMap } from 'rxjs/operators';

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
  hide_show_assign_to: boolean = false;
  statuses = Object.values(TechStatus);

  isAcceptedTechnical: boolean = false;
  filteredComponents!: Observable<any[]>;
  fileName: string = '';


  componentsFormInput: FormGroup;
  inputsOfComponentsForm: any[] = [];

  inputsOfImportantComponentsForm: any[] = [];
  importantComponentsFormInput: FormGroup;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private formBuilderImportantComponents: FormBuilder,
    public dialogRef: MatDialogRef<CreateUpdateTechStateComponent>,
    private notificationService: NotificationService,
    private service: UserRepairActionService,
    public storageService: StorageService,
    private userService: UserServiceService,
    private componentService: ComponentService,
    private snackBar: MatSnackBar
  ) {
    this.componentsFormInput = this.formBuilder.group({});
    
    this.importantComponentsFormInput = this.formBuilderImportantComponents.group({});

    this.form = this.service.form;
    this.setupAssignUsers();
    if (this.storageService.hasRole(ERole.ROLE_ADMIN) ||
      this.storageService.hasRole(ERole.ROLE_REPAIR_TECHNICIAN_HEAD)) {
      this.hide_show_assign_to = true;
    }
    this.setupProductNameField();
    this.setupImportantProductNameField();
  }
  ngOnInit(): void {
    this.componentsFormInput = this.formBuilder.group({});
    this.importantComponentsFormInput = this.formBuilderImportantComponents.group({});
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
      } else {
        this.isAcceptedTechnical = false
      }
    });
    const assignedUsersServiceControl = this.service.form.controls?.['assign_to'];
    if (assignedUsersServiceControl?.value) {
      this.filteredAssignUsers = of([assignedUsersServiceControl?.value])
    }

    this.setupAssignUsers();
    this.loadInitialData();
  }

  scrollStep(event: WheelEvent): void {
    const direction = Math.sign(event.deltaY);
    const stepHeight = 100 * 3; // 3 times the height of each item
    this.scrollContainer.nativeElement.scrollTop += stepHeight * direction;

    // Prevent the default scroll behavior
    event.preventDefault();
  }

  loadInitialData() {
    this.loadInitialNeededComponents();
    this.loadInitialImportantComponents();
  }
  loadInitialNeededComponents() {
    let neededComponents = this.form.controls?.['needed_components'].value as NeededComponent[];
    console.log(neededComponents); // Before the loop
    neededComponents.forEach((dataRow, index) => {
      
      console.log(dataRow);
      debugger
      const formGroupName = `inputGroup${index}`;
      this.inputsOfComponentsForm.push(formGroupName);
      // this.componentsFormInput.get([formGroupName, 'autocomplete'])!.patchValue(data.autocomplete); 
     
      this.componentsFormInput.addControl(formGroupName, this.formBuilder.group({
        autocomplete: [dataRow?.component?.name, Validators.required],
        number: [dataRow.needed_count, Validators.pattern(/^\d+$/)],
      }));
    });
  }

  loadInitialImportantComponents() {
    let neededComponents = this.form.controls?.['important_components'].value as NeededComponent[];
    console.log(neededComponents); // Before the loop
    neededComponents.forEach((dataRow, index) => {
      
      console.log(dataRow);
      debugger
      const formGroupName = `inputGroupImportant${index}`;
      this.inputsOfImportantComponentsForm.push(formGroupName);
      // this.componentsFormInput.get([formGroupName, 'autocomplete'])!.patchValue(data.autocomplete); 
     
      this.importantComponentsFormInput.addControl(formGroupName, this.formBuilderImportantComponents.group({
        autocomplete: [dataRow?.component?.name, Validators.required],
        number: [dataRow.needed_count, Validators.pattern(/^\d+$/)],
      }));
    });
  }

  setupProductNameField(): void {
    this.filteredComponents = this.form.controls?.['needed_components'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterComponents(value))
    );
  }

  setupImportantProductNameField(): void {
    this.filteredComponents = this.form.controls?.['important_components'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterImportantComponents(value))
    );
  }

  addInput() {
    const index = this.inputsOfComponentsForm.length;
    const formGroupName = `inputGroup${index}`;
    this.inputsOfComponentsForm.push(formGroupName);

    this.componentsFormInput.addControl(formGroupName, this.formBuilder.group({
      autocomplete: ['', Validators.required],
      number: [1, [Validators.pattern(/^\d+$/), Validators.min(1)]],
    }));
  }


  removeInput(index: number) {
    const formGroupName = this.inputsOfComponentsForm[index];
    this.inputsOfComponentsForm.splice(index, 1);
    this.componentsFormInput.removeControl(formGroupName);
  }


  addImportantInput() {
    const index = this.inputsOfImportantComponentsForm.length;
    const formGroupName = `inputGroupImportant${index}`;
    this.inputsOfImportantComponentsForm.push(formGroupName);

    this.importantComponentsFormInput.addControl(formGroupName, this.formBuilderImportantComponents.group({
      autocomplete: ['', Validators.required],
      number: [1, [Validators.pattern(/^\d+$/), Validators.min(1)]],
    }));
  }


  removeImportantInput(index: number) {
    const formGroupName = this.inputsOfImportantComponentsForm[index];
    this.inputsOfImportantComponentsForm.splice(index, 1);
    this.importantComponentsFormInput.removeControl(formGroupName);
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
    this.form.controls?.['important_components'].setValue(this.getImportantComponents())
    this.form.controls?.['needed_components'].setValue(this.getNeededComponents())

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

  getImportantComponents(){
    const importantComponents: any[] = [];
    let negativeSequence = -2;
    this.inputsOfImportantComponentsForm.forEach(formGroupName => {

      const formGroup = this.importantComponentsFormInput.get(formGroupName);

      let component = formGroup!.value.autocomplete;
      if (typeof component === 'string') {
        component = new Components();
        component.id = negativeSequence--;
        component.name = formGroup!.value.autocomplete;
      }
      const number = formGroup!.value.number;
 
      importantComponents.push({
        component,
        needed_count: number
      });

    });
    return importantComponents;
  }

  getNeededComponents(){
    const neededComponents: any[] = [];
    let negativeSequence = -2;
    this.inputsOfComponentsForm.forEach(formGroupName => {

      const formGroup = this.componentsFormInput.get(formGroupName);

      let component = formGroup!.value.autocomplete;
      if (typeof component === 'string') {
        component = new Components();
        component.id = negativeSequence--;
        component.name = formGroup!.value.autocomplete;
      }
      const number = formGroup!.value.number;
 
      neededComponents.push({
        component,
        needed_count: number
      });

    });
    return neededComponents;
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
    
    if (typeof component === 'string') {
      return component; 
    }  
    return component?.name ?? '';
  }


  displayFnAssignUser(user?: User): string {
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

  private filterImportantComponents(name: string): Observable<Components[]> {
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

  onClose(): void {
    this.form.reset();
    this.dialogRef.close();
  }

}
