import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Card, CardStatus, User } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/cards`;
 
  constructor(private http: HttpClient,
    private storageService: StorageService) {
  }

  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      serial_no: new FormControl(''),
      issue_description: new FormControl(''),
      company: new FormControl(null, Validators.required),
      important_components_of_card: new FormControl([]),
      suggested_offer_repair_cost: new FormControl(0, [Validators.required, Validators.min(0)]),
      repair_cost: new FormControl(0, [Validators.required, Validators.min(0)]),
      amount_paid: new FormControl(0, [Validators.required, Validators.min(0)]),
      // user_actions: new FormControl([]),
      // card_state: new FormControl(CardState.ENTERED, Validators.required),
      no_of_card_pieces: new FormControl(1, [Validators.required, Validators.min(1)]),
      warranty_period_per_days: new FormControl(30, [Validators.required, Validators.min(1)]),
      logged_in_user: new FormControl(this.storageService.getUser()),
      deliver_card_user: new FormControl(null),
      component_image: new FormControl(''),
      component_image_file_name: new FormControl('')
    });
    return this.form;
  }

  getCards(page: number, pageSize: number): Observable<any> {
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

  createCard(card: Card): Observable<Card> {
    // debugger
    return this.http.post<Card>(this.apiUrl, card).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getCardById(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateCard(id: number, card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card).pipe(
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
      serial_no: row.serial_no || '',
      issue_description: row.issue_description || '',
      company: row.company || '',
      important_components_of_card: row.important_components_of_card || [],
      suggested_offer_repair_cost: row.suggested_offer_repair_cost || 0,
      repair_cost: row.repair_cost || 0,
      amount_paid: row.amount_paid || 0,
      // user_actions: row.user_actions || [],
      // card_state: row.card_state || CardState.ENTERED,
      no_of_card_pieces: row.no_of_card_pieces || 0,
      logged_in_user: row.logged_in_user || '',
      deliver_card_user: row.deliver_card_user || '',
      component_image: row.component_image || '',
      component_image_file_name: row.component_image_file_name || '',
      warranty_period_per_days: row.warranty_period_per_days
    });
  }
}
