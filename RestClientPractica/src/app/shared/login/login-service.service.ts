import { Injectable } from '@angular/core';
import { header, User } from '../app.model';
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
  urlApi: string = 'http://localhost:5121/login';
  currentUser = {};
  constructor(private http: HttpClient, public router: Router) {}

  signIn(email: string, pass: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email: email, password: pass };
    console.log(JSON.stringify(body));
    return this.http
      .post(this.urlApi, JSON.stringify(body), {
        headers: headers,
        observe: 'response',
      })
      .subscribe((response) => {
        console.log(response.status);
        console.log(response.body);

        let header_token : header;
        header_token = (response.body as header);
        console.log('Token : ' + header_token.access_token);

        localStorage.setItem('access_token', header_token.access_token);
        this.router.navigate(["/users"]);
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
}
