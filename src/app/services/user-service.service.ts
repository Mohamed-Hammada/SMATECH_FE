import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role, User } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RulesService } from './rules.service';
import { StorageService } from '../_services/storage.service';
import { NotificationService } from 'src/app/_helpers/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/users`;

  constructor(
    private http: HttpClient,
    private rulesService: RulesService,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.rulesService.getRoles().subscribe(data => {
      this.storageService.saveAllRoles(data.data);
    },
    error => {
      this.notificationService.warn(error.message);
    });
  }

  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      phones: new FormControl([], Validators.required),
      password: new FormControl('', Validators.required),
      // type: new FormControl('', Validators.required),
      enabled: new FormControl('', Validators.required),
      roles: new FormControl(this.storageService.getAllRoles(), Validators.required),
    });
    return this.form
  }

  filterExactRole(all: Role[], val: string): Role[] {
    return all.filter(ele => ele.name === val);
  }

  getUsers(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  deleteById(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  populateForm(row: any): void {
    this.form.setValue({
      id: row.id,
      email: row.email || '',
      username: row.username || '',
      phones: row.phones || [],
      password: row.password || '',
      // type: row.type || '',
      enabled: row.enabled || false,
      roles: row.roles || []
    });
  }
}
