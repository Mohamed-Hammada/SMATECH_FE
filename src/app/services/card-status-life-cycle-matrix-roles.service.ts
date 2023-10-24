import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CardStatus, CardStatusLifeCycleMatrixRoles, Role } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CardStatusLifeCycleMatrixRolesService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/card-status-life-cycle-matrix-roles`;

  constructor(private http: HttpClient) {
  }



  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      card_status_life_cycle: new FormControl(CardStatus.DELIVERY_PENDING),
      role: new FormControl(null)
    });
    return this.form
  }


  getCardStatusLifeCycleMatrixRolesService(page: number, pageSize: number): Observable<any> {
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

  searchByString(page: number, pageSize: number,search_string: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('search_string', search_string);

    return this.http.get<any>(this.apiUrl+ "/searchByString", { params }).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  createCardStatusLifeCycleMatrixRoles(cardStatusLifeCycleMatrixRoles: CardStatusLifeCycleMatrixRoles): Observable<CardStatusLifeCycleMatrixRoles> {
    return this.http.post<CardStatusLifeCycleMatrixRoles>(this.apiUrl, cardStatusLifeCycleMatrixRoles).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getCardStatusLifeCycleMatrixRolesById(id: number): Observable<CardStatusLifeCycleMatrixRoles> {
    return this.http.get<CardStatusLifeCycleMatrixRoles>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateCardStatusLifeCycleMatrixRoles(id: number, cardStatusLifeCycleMatrixRoles: CardStatusLifeCycleMatrixRoles): Observable<CardStatusLifeCycleMatrixRoles> {
    return this.http.put<CardStatusLifeCycleMatrixRoles>(`${this.apiUrl}/${id}`, cardStatusLifeCycleMatrixRoles).pipe(
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

  searchCardStatusLifeCycleMatrixRolesService(query: string): Observable<CardStatusLifeCycleMatrixRoles[]> {
    // debugger
    const params = new HttpParams().set('query', query);
    return this.http.get<CardStatusLifeCycleMatrixRoles[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  populateForm(row: any): void {
    this.form.setValue({
      id: row.id,
      card_status_life_cycle: row.card_status_life_cycle || '',
      role: row?.role?.name || ''
    });
  }
}
