import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRepairAction, User, CardStatusLifeCycle } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserRepairActionService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/userRepairActions`;

  constructor(private http: HttpClient,
    private storageService: StorageService) {
  }

  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      user: new FormControl(null),
      card: new FormControl(null),
      action_needed: new FormControl(''),
      note: new FormControl(''),
      needed_components: new FormControl([]),
      assign_to: new FormControl(null),
      logged_in_user: new FormControl(this.storageService.getUser())
    });
    return this.form;
  }


  findUserRepairActionsByCardStatusAndUser(page: number, pageSize: number, card_status_life_cycle:CardStatusLifeCycle): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('card_status_life_cycle', card_status_life_cycle)
      .set('logged_in_user_id', this.storageService.getUser()?.id.toString() || '');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getUserRepairActions(page: number, pageSize: number): Observable<any> {
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

  createUserRepairAction(userRepairAction: UserRepairAction): Observable<UserRepairAction> {
    debugger
    return this.http.post<UserRepairAction>(this.apiUrl, userRepairAction).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getUserRepairActionById(id: number): Observable<UserRepairAction> {
    return this.http.get<UserRepairAction>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateUserRepairAction(id: number, userRepairAction: UserRepairAction): Observable<UserRepairAction> {
    return this.http.put<UserRepairAction>(`${this.apiUrl}/${id}`, userRepairAction).pipe(
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
      user: row.user,
      card: row.card,
      action_needed: row.action_needed,
      card_status_life_cycle: row.card_status_life_cycle,
      note: row.note,
      needed_components: row.needed_components,
      assign_to: row.assign_to,
      logged_in_user: row.logged_in_user || '',
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

}
