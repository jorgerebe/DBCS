import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from './shared/app.model';
import { LoginService } from './shared/login/login-service.service';
import { LoginGuard } from './shared/login/login.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  router;
  title = 'Gestor Usuarios';
  private role;

  isLoggedNow!: boolean;

  loginGuard!: LoginGuard;
  loginService!: LoginService;

  subscriptionLoggedIn!: Subscription;

  constructor(guard: LoginGuard, loginService: LoginService, router: Router) {
    this.loginGuard = guard;
    this.loginService = loginService;
    this.router = router;
    this.role = loginService.getRole();
  }

  isLogged() {
    return this.loginService.isLoggedIn;
  }

  logOut() {
    this.loginService.doLogout();
  }
  isUrlUsers() {
    if (this.router.url.indexOf('/users') > -1) {
      return true;
    } else {
      return false;
    }
  }
  isUrlReservas() {
    if (this.router.url.indexOf('/reservas') > -1) {
      return true;
    } else {
      return false;
    }
  }
  getRole(): String {
    if (this.role != null) {
      return this.role.toString();
    } else {
      return '';
    }
  }
}
