import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Role } from '../models/all.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  private apiUrl = `${environment.baseUrl}/api/roles`;

  // Create a BehaviorSubject with an empty array as the initial value
  private rolesSubject = new BehaviorSubject<Role[]>([]);

  // Expose the BehaviorSubject as an Observable
  public roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) { }


  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      catchError(error => {
        // Handle the error here
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );;
  }

  search(query: string): Observable<Role[]> {
    // debugger
    const params = new HttpParams().set('query', query);
    return this.http.get<Role[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        console.error('Error Message: ', error);
        return throwError(error);
      })
    );
  }
}
