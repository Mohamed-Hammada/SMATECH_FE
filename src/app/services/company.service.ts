import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Company } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/company`;

  constructor(private http: HttpClient) {
  }



  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', Validators.required),
      customer_name: new FormControl(''),
      area: new FormControl('', Validators.required),
      phones: new FormControl([], Validators.required)
    });
    return this.form
  }


  getCompanies(page: number, pageSize: number): Observable<any> {
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
  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateCompany(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company).pipe(
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

  searchCompanies(query: string): Observable<Company[]> {
    // debugger
    const params = new HttpParams().set('query', query);
    return this.http.get<Company[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  populateForm(row: any): void {
    this.form.setValue({
      id: row.id,
      name: row.name || '',
      customer_name: row.customer_name || '',
      phones: row.phones || [],
      area: row.area || ''
    });
  }
}
