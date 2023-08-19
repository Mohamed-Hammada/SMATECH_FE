import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Components } from '../models/all.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  form: FormGroup = this.initializeFormGroup();
  private apiUrl = `${environment.baseUrl}/api/components`;

  constructor(private http: HttpClient) {
  }



  initializeFormGroup(): FormGroup {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      current_exist_quantity: new FormControl(0, Validators.required),
      last_price_of_unit: new FormControl(0, Validators.required),
      component_image: new FormControl(''),
      component_image_file_name: new FormControl('')
    });
    return this.form
  }

  searchComponents(query: string): Observable<Components[]> {
    debugger
    const params = new HttpParams().set('query', query);
    return this.http.get<Components[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }


  getComponents(page: number, pageSize: number): Observable<any> {
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

  createComponent(component: Components): Observable<Components> {
    return this.http.post<Components>(this.apiUrl, component).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  getComponentById(id: number): Observable<Components> {
    return this.http.get<Components>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }

  updateComponent(id: number, component: Components): Observable<Components> {
    return this.http.put<Components>(`${this.apiUrl}/${id}`, component).pipe(
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
      name: row.name || '',
      description: row.description || '',
      current_exist_quantity: row.current_exist_quantity || 0,
      last_price_of_unit: row.last_price_of_unit || 0,
      component_image: row.component_image || '',
      component_image_file_name: row.component_image_file_name || ''
    });

  }
}
