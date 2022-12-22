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
import { ReservaCrearComponent } from './reserva-crear/reserva-crear.component';
import { DatePipe } from '@angular/common';
import { ReservaEditarComponent } from './reserva-editar/reserva-editar.component';
import { ReservaAvailabilityComponent } from './reserva-availability/reserva-availability.component';
import { StatusPipePipe } from './shared/status-pipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UserListarComponent,
    EditarUserComponent,
    CrearUserComponent,
    ToastsContainer,
    LoginComponent,
    ReservaListarComponent,
    ReservaCrearComponent,
    ReservaEditarComponent,
    ReservaAvailabilityComponent,
    StatusPipePipe,
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
    DatePipe,
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
