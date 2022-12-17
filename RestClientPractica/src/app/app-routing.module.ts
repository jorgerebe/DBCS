import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserListarComponent } from './user-listar/user-listar.component';
import { EditarUserComponent } from './user-editar/user-editar.component';
import { CrearUserComponent } from './user-crear/user-crear.component';
import { LoginGuard } from './shared/login/login.guard';
import { ReservaListarComponent } from './reserva-listar/reserva-listar.component';
import { ReservaCrearComponent } from './reserva-crear/reserva-crear.component';
import { ReservaEditarComponent } from './reserva-editar/reserva-editar.component';
import { GuestRoleGuard } from './shared/login/guest-role.guard';
import { HostRoleGuard } from './shared/login/host-role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'users',
    component: UserListarComponent,
    title: 'Gestor Usuarios',
    canActivate: [LoginGuard],
  },
  {
    path: 'users/:id/editar',
    component: EditarUserComponent,
    title: 'Editar usuario',
    canActivate: [LoginGuard],
  },
  {
    path: 'users/nuevo',
    component: CrearUserComponent,
    title: 'Añadir usuario',
    canActivate: [LoginGuard],
  },
  {
    path: 'reservas',
    component: ReservaListarComponent,
    title: 'Gestor Reservas',
    canActivate: [LoginGuard],
  },
  {
    path: 'reservas/nuevo',
    component: ReservaCrearComponent,
    title: 'Añadir Reserva',
    canActivate: [LoginGuard, GuestRoleGuard],
  },

  {
    path: 'reservas/:id/editar',
    component: ReservaEditarComponent,
    title: 'Editar reserva',
    canActivate: [LoginGuard, HostRoleGuard],
  },

  {
    path: '**',
    redirectTo: 'users',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
