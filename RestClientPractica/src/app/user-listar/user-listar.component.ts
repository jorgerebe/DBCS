import { Component, OnInit,ViewChild } from '@angular/core';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';
import { User} from '../shared/app.model';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../shared/toast-service';

@Component({
  selector: 'app-user-listar',
  templateUrl: './user-listar.component.html',
  styleUrls: ['./user-listar.component.css']
})
export class UserListarComponent implements OnInit{
  
  private route : any = '';
  Users!: User[];
  tipoMensaje!: string;
  mensaje!: string;
  enabled : boolean | undefined;

  subscriptionTipo !: Subscription;
  subscriptionMensaje! : Subscription;

  constructor(
    private ruta: ActivatedRoute,
    private router: Router,
    private clienteApiRest: ClienteApiRestService,
    private datos: ToastService)
  {
  }

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert;

  ngOnInit() {

    this.subscriptionTipo = this.datos.tipoActual.subscribe(
      valor => {
        this.tipoMensaje=valor;
      }
    )

    this.subscriptionMensaje = this.datos.mensajeActual.subscribe(
      valor => {
        this.mensaje=valor;
        if(this.mensaje.length != 0){
          console.log("suscrito");
          this.showToast(this.mensaje, this.tipoMensaje);
        }
      }
    );

    this.ruta.queryParams.subscribe(
      params => {
        this.enabled = params['enabled'];
        this.getUsers_AccesoResponse();
      }
    )

    }
     ngOnDestroy(){
      this.subscriptionMensaje.unsubscribe();
      this.subscriptionTipo.unsubscribe();
     }



    getUsers_AccesoResponse() {

    this.clienteApiRest.getAllUsers_ConResponse(this.enabled).subscribe(
    resp =>{
    
    if (resp.status < 400 ) {
    this.Users = resp.body!;
    } else {
    this.mensaje = 'Error al acceder a los datos';
    }
    },
    err => {
    console.log("Error al traer la lista: " + err.message);
    throw err;
    }
    )

    }
    borrar(id: Number, name: String) {
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
    }

    public onEnabledUserChanged(event: EventTarget | null, id: Number){

      var ids : String[] = [String(id)];

      if(EventTarget != null){
        let ischecked = (<HTMLInputElement>event).checked;
        if(ischecked == true){
          this.clienteApiRest.setUserEnabled(ids).subscribe({
            next: resp => {
            if (resp.status < 400) {
              this.datos.cambiarTipo('info');
              this.datos.cambiarMensaje(resp.body);
            } else {
            this.mensaje = "Error al activar el usuario";
            }
            },
            error: err=> {
            console.log("Error al activar: " + err.message);
            throw err;
            }}
            )
        }else{

          this.clienteApiRest.setUserDisabled(ids).subscribe({
            next: resp => {
            if (resp.status < 400) { 
              this.datos.cambiarTipo('info');
              this.datos.cambiarMensaje(resp.body);
            } else {
            this.mensaje = "Error al desactivar registro";
            }
            },
            error: err=> {
            console.log("Error al desactivar: " + err.message);
            throw err;
            }}
            )
        }
      }
      
      
    }

    desactivarTodos(){
      this.clienteApiRest.setUserDisabled(this.Users.map(i => i.id.toString())).subscribe(
        resp => {
        if (resp.status < 400) { 
          this.datos.cambiarTipo('success');
        this.datos.cambiarMensaje(resp.body);
        this.getUsers_AccesoResponse();
        } else {
        this.mensaje = "Error al actualizar estado";
        }
        },
        err=> {
        console.log("Error al actualizar estado: " + err.message);
        throw err;
        }
        )
    }

    activarTodos(){
      this.clienteApiRest.setUserEnabled(this.Users.map(i => i.id.toString())).subscribe(
        resp => {
        if (resp.status < 400) {
        this.datos.cambiarTipo('success');
        this.datos.cambiarMensaje(resp.body);
        this.getUsers_AccesoResponse();
        } else {
        this.mensaje = "Error al actualizar estado";
        }
        },
        err=> {
        console.log("Error al actualizar estado: " + err.message);
        throw err;
        }
        )
    }

    showToast(mensaje : string, tipo:string) {
      this.datos.show(mensaje, {classname : 'bg-' + tipo, delay:2500});
    }

}