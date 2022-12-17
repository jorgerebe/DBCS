import { Component, OnInit, ViewChild } from '@angular/core';
import { Reserva } from '../shared/app.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../shared/toast-service';
import { ReservaApiRestService } from '../shared/reserva-api-rest.service';
import { LoginService } from '../shared/login/login-service.service';

@Component({
  selector: 'app-reserva-listar',
  templateUrl: './reserva-listar.component.html',
  styleUrls: ['./reserva-listar.component.css'],
})
export class ReservaListarComponent implements OnInit {
  private route: any = '';
  Reservas!: Reserva[];
  tipoMensaje!: string;
  mensaje!: string;
  enabled: boolean | undefined;
  private role;
  subscriptionTipo!: Subscription;
  subscriptionMensaje!: Subscription;

  constructor(
    private ruta: ActivatedRoute,
    private router: Router,
    private reservasApiRest: ReservaApiRestService,
    private datos: ToastService,
    private loginService: LoginService
  ) {
    this.role = loginService.getRole();
  }

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert;

  ngOnInit() {
    this.subscriptionTipo = this.datos.tipoActual.subscribe((valor) => {
      this.tipoMensaje = valor;
    });

    this.subscriptionMensaje = this.datos.mensajeActual.subscribe((valor) => {
      this.mensaje = valor;
      if (this.mensaje.length != 0) {
        console.log('suscrito');
        this.showToast(this.mensaje, this.tipoMensaje);
      }
    });

    this.ruta.queryParams.subscribe((params) => {
      this.enabled = params['enabled'];
      this.getReservas_AccesoResponse();
    });
  }
  ngOnDestroy() {
    this.subscriptionMensaje.unsubscribe();
    this.subscriptionTipo.unsubscribe();
  }

  getReservas_AccesoResponse() {
    this.reservasApiRest.getAllReservas_ConResponse(this.enabled).subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.Reservas = resp.body!;
        } else {
          this.mensaje = 'Error al acceder a los datos';
        }
      },
      (err) => {
        console.log('Error al traer la lista: ' + err.message);
        throw err;
      }
    );
  }
  /* borrar(id: Number, name: String) {
    if(confirm("¿Seguro que quieres borrar el usuario " + name + "?")){
    this.clienteApiRest.borrarUser(String(id)).subscribe(
    resp => {
    if (resp.status < 400) { 
      this.datos.cambiarTipo("danger");
      this.datos.cambiarMensaje(resp.body);
      this.getUsers_AccesoResponse();
    } else {
      this.mensaje = "Error al eliminar registro";
    }
    },
    err=> {
    console.log("Error al borrar: " + err.message);
    throw err;
    }
    )}
    } */

  showToast(mensaje: string, tipo: string) {
    this.datos.show(mensaje, { classname: 'bg-' + tipo, delay: 2500 });
  }

  getRole(): String {
    if (this.role != null) {
      return this.role.toString();
    } else {
      return '';
    }
  }
}
