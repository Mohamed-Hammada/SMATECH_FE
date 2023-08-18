import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Role, User } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RulesService } from './rules.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private roles: Role[] = [];
  form!: FormGroup;

  private apiUrl = `${environment.baseUrl}/api/users`

  constructor(private http: HttpClient,private rulesService : RulesService) {
    this.rulesService.roles$.subscribe(data => {
      // Store the fetched roles data
      this.roles = data;

      // Do something with the roles data here, like filtering users by role, etc.
      this.processUserData();
    });
  }
  private processUserData(): void {
    // Example: Filter users by a specific role or do something else with this.roles
    console.log('Roles available in UserServiceService:', this.roles);
  }


  initializeFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(null),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      phones: new FormControl('', Validators.required),
      password: new FormControl([], Validators.required),
      type: new FormControl('', Validators.required),
      enabled: new FormControl('', Validators.required),
      roles: new FormControl([], Validators.required),
    });
  }

  filterExactRole(all: Role[], val: string) {
    return all.filter((ele) => {
      return ele.name == val
    })
  }

  filterExactRoles(val: string[]) {
    return this.roles.filter((ele) => {
      return val.includes(ele.name)
    })
  }

  getUsers(page: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params: params }).pipe(
      catchError(error => {
        // Handle the error here
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );;
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, user).pipe(
      catchError(error => {
        // Handle the error here
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        // Handle the error here
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateUser(id: number, user: User): Observable<User> {

    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(error => {
        // Handle the error here
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  deleteById(id: any): Observable<any> {
    console.log(`${this.apiUrl}deleteById/${id}`)
    return this.http.delete(`${this.apiUrl}deleteById/${id}`).pipe(
      catchError(error => {
        // Handle the error here
        console.error('Error Message: ', error);
        return throwError(error);
      })
    )
  }
  populateForm(row: any) {
    this.form.setValue({
      id: row.id,
      email: row.email,
      username: row.username,
      phones: row.phones,
      password: row.password,
      type: row.type,
      enabled: true,
      roles: row.roles ? this.filterExactRoles(row.roles) : []
    })
  }
}
