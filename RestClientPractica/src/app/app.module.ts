import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClienteApiRestService } from './shared/cliente-api-rest.service';
import { UserListarComponent } from './user-listar/user-listar.component';
import { EditarUserComponent } from './user-editar/user-editar.component';
import { CrearUserComponent } from './user-crear/user-crear.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastsContainer } from './shared/toasts-container.component';
import { ToastService } from './shared/toast-service';



@NgModule({
  declarations: [
    AppComponent,
    UserListarComponent,
    EditarUserComponent,
    CrearUserComponent,
    ToastsContainer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    ClienteApiRestService,
    ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
