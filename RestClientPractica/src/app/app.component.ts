import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from './shared/login/login-service.service';
import { LoginGuard } from './shared/login/login.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestor Usuarios';

  isLoggedNow!:boolean;

  loginGuard!:LoginGuard;
  loginService!:LoginService

  subscriptionLoggedIn !: Subscription;

  constructor(guard:LoginGuard, loginService:LoginService)
  {
    this.loginGuard = guard;
    this.loginService = loginService;
  }

  isLogged(){
    return this.loginService.isLoggedIn;
  }

  logOut(){
    this.loginService.doLogout();
  }
}
