import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListarComponent } from './user-listar/user-listar.component';
import { EditarUserComponent } from './user-editar/user-editar.component';

const routes: Routes = [
  {path: 'users', component:UserListarComponent},
  {path: 'users/:id/editar', component:EditarUserComponent},
  {path: '**', redirectTo:'users',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
