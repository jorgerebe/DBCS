import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../app.model';
import { LoginService } from './login-service.service';
@Injectable({
  providedIn: 'root',
})
export class GuestRoleGuard implements CanActivate {
  constructor(public loginService: LoginService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.loginService.getRole() == Role.GUEST) {
      return true;
    } else {
      return false;
    }
  }
}
