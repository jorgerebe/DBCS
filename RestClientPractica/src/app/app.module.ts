import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClienteApiRestService } from './shared/cliente-api-rest.service';
import { DataService } from './shared/data.service';
import { UserListarComponent } from './user-listar/user-listar.component';
import { EditarUserComponent } from './user-editar/user-editar.component';



@NgModule({
  declarations: [
    AppComponent,
    UserListarComponent,
    EditarUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ClienteApiRestService,
    DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
