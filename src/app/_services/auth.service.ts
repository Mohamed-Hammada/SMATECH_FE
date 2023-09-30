import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const AUTH_API = `${environment.baseUrl}/api/auth/`

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    ).pipe(
      catchError((err) => {
        // Throw an error if the HTTP request fails
        return throwError(err);
      })
    );
  }
  

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    ).pipe(
      catchError((err) => {
        // Throw an error if the HTTP request fails
        return throwError(err);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions).pipe(
      catchError((err) => {
        // Throw an error if the HTTP request fails
        return throwError(err);
      })
    );
  }

  refreshToken() {
    return this.http.post(AUTH_API + 'refreshtoken', { }, httpOptions).pipe(
      catchError((err) => {
        // Throw an error if the HTTP request fails
        return throwError(err);
      })
    );
  }
}
