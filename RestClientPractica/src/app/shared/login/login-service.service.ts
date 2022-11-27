import { Injectable } from '@angular/core';
import { User } from '../app.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  urlApi: string = 'http://localhost:5121/login ';
  currentUser = {};
  constructor(private http: HttpClient, public router: Router) {}

  signIn(email: string, pass: string) {
    const params = new HttpParams().append('email', email).append('password', pass);
    return this.http
      .post<any>(this.urlApi, { params: params })
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res);
        this.router.navigate(['users']);
      });
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
