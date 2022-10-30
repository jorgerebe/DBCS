import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListarComponent } from './user-listar/user-listar.component';
import { EditarUserComponent } from './user-editar/user-editar.component';
import { CrearUserComponent } from './user-crear/user-crear.component';

const routes: Routes = [
  {path: 'users', component:UserListarComponent},
  {path: 'users/:id/editar', component:EditarUserComponent},
  {path: 'users/nuevo', component:CrearUserComponent},
  {path: '**', redirectTo:'users',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
