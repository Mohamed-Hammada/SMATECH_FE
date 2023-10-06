import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRepairAction, CardStatus,Department } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserRepairActionService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/user-repair-actions`;

  constructor(private http: HttpClient,
    private storageService: StorageService) {
  }

  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      user: new FormControl(null),
      card: new FormControl(null),
      note: new FormControl(''),
      needed_components: new FormControl([]),
      assign_to: new FormControl(null),
      logged_in_user: new FormControl(this.storageService.getUser()),
      serial_no: new FormControl(''),
      suggested_offer_repair_cost: new FormControl(0),
      repair_cost: new FormControl(0),
      amount_paid: new FormControl(0),
      additional_amount_paid: new FormControl(0),
    });
    return this.form;
  }


  getUserRepairActionsByCardStatusAndUserAndDepartment(page: number, pageSize: number, card_status_life_cycle: CardStatus[],department: Department): Observable<any> {
    const cardStatusLifeCycleValues = card_status_life_cycle.map(value => CardStatus[value]);

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('department', department.toString())
      .set('card_status_life_cycle', JSON.stringify(cardStatusLifeCycleValues))
      .set('logged_in_user_id', this.storageService.getUser()?.id.toString() || '');
      
    return this.http.get<any>(this.apiUrl + "/ByCardStatusAndUserAndDepartment", { params }).pipe(
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
    // debugger
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
  updateOfferState( offerStateDTORequest: UserRepairAction): Observable<UserRepairAction> {
    return this.http.put<UserRepairAction>(`${this.apiUrl}/offer-state`, offerStateDTORequest).pipe(
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
      note: row.note,
      needed_components: row.needed_components,
      assign_to: row.assign_to,
      logged_in_user: row.logged_in_user || '',
      serial_no: row.card.serial_no,
      suggested_offer_repair_cost: row.card.suggested_offer_repair_cost || 0,
      repair_cost: row.card.repair_cost || 0,
      amount_paid: row.card.amount_paid || 0,
      additional_amount_paid: 0
    });
  }

}
