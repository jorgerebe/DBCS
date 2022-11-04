import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListarComponent } from './user-listar/user-listar.component';
import { EditarUserComponent } from './user-editar/user-editar.component';
import { CrearUserComponent } from './user-crear/user-crear.component';

const routes: Routes = [
  {path: 'users', component:UserListarComponent, title:'Gestor Usuarios'},
  {path: 'users/:id/editar', component:EditarUserComponent, title:'Editar usuario'},
  {path: 'users/nuevo', component:CrearUserComponent, title:'Añadir usuario'},
  {path: '**', redirectTo:'users',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
