import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { LoginService } from './login-service.service';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable()
export class LoginInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.loginService.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 403) {
          this.loginService.doLogout();
        }
        if (err.status === 401) {
          this.loginService.doLogout();
        }
        const error = err.error.message || err.statusText;
        return throwError(() => error);
      })
    );
  }
}
