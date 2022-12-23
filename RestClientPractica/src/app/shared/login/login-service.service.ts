import { Injectable } from '@angular/core';
import { header, Role, User } from '../app.model';
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
  urlApi: string = 'http://localhost:8000/api/login';
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

        let header_token: header;
        header_token = response.body as header;

        localStorage.setItem('access_token', header_token.access_token);
        this.getRole();
        this.getID();
        this.router.navigate(['/users']).then(() => {
          window.location.reload();
        });
      });
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  getRole(): Role | undefined {
    var token = localStorage.getItem('access_token');
    var rol;
    if (token != null) {
      var split = JSON.parse(window.atob(token.split('.')[1]));

      rol = Role[split.role as keyof typeof Role];
      return rol;
    } else {
      return undefined;
    }
  }
  getID(): number | undefined {
    var token = localStorage.getItem('access_token');
    var id;
    if (token != null) {
      var split = JSON.parse(window.atob(token.split('.')[1]));

      id = split.id;
      console.log(id);
      return id;
    } else {
      return undefined;
    }
  }
  getName(): String {
    var token = localStorage.getItem('access_token');
    var name;
    if (token != null) {
      var split = JSON.parse(window.atob(token.split('.')[1]));

      name = split.name;
      console.log(name);
      return name;
    } else {
      return '';
    }
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['login']).then(() => {
        window.location.reload();
      });
    }
  }
}
