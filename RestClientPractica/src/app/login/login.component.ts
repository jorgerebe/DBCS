import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../shared/login/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService,
    public router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }
  ngOnInit(): void {}

  login() {
    console.log(this.loginForm.value);
    -this.loginService.signIn(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    );
  }
}
