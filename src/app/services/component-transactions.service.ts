import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ComponentTransaction, TransactionType } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ComponentTransactionService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/component-transactions`;

  constructor(private http: HttpClient) {
  }

  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      component: new FormControl('', Validators.required),
      transaction_date: new FormControl(new Date(), Validators.required),
      transaction_type: new FormControl(TransactionType.ADD, Validators.required),
      quantity: new FormControl(0, Validators.required),
      price_unit: new FormControl(0, Validators.required)
    });
    return this.form;
  }

  getComponentTransactions(page: number, pageSize: number): Observable<any> {
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

  createComponentTransaction(componentTransaction: ComponentTransaction): Observable<ComponentTransaction> {
    return this.http.post<ComponentTransaction>(this.apiUrl, componentTransaction).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getComponentTransactionById(id: number): Observable<ComponentTransaction> {
    return this.http.get<ComponentTransaction>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateComponentTransaction(id: number, componentTransaction: ComponentTransaction): Observable<ComponentTransaction> {
    return this.http.put<ComponentTransaction>(`${this.apiUrl}/${id}`, componentTransaction).pipe(
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
      component: row.component || '',
      transaction_date: row.transaction_date || new Date(),
      transaction_type: row.transaction_type || TransactionType.ADD,
      quantity: row.quantity || 0,
      price_unit: row.price_unit || 0
    });
  }
}
