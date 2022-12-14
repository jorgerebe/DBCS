import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginInterceptor } from './shared/login/login.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClienteApiRestService } from './shared/cliente-api-rest.service';
import { UserListarComponent } from './user-listar/user-listar.component';
import { EditarUserComponent } from './user-editar/user-editar.component';
import { CrearUserComponent } from './user-crear/user-crear.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastsContainer } from './shared/toasts-container.component';
import { ToastService } from './shared/toast-service';
import { LoginComponent } from './login/login.component';
import { ReservaListarComponent } from './reserva-listar/reserva-listar.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListarComponent,
    EditarUserComponent,
    CrearUserComponent,
    ToastsContainer,
    LoginComponent,
    ReservaListarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [
    ClienteApiRestService,
    ToastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoginInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
