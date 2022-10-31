import { Component, OnChanges, OnInit,ViewChild, ɵɵqueryRefresh } from '@angular/core';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';
import { User} from '../shared/app.model';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DataService } from '../shared/data.service';
import { debounceTime, Subject } from 'rxjs';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-listar',
  templateUrl: './user-listar.component.html',
  styleUrls: ['./user-listar.component.css']
})
export class UserListarComponent implements OnInit{
  
  private route : any = '';
  private _success = new Subject<string>();
  successMessage = '';
  Users!: User[];
  mostrarMensaje!: boolean;
  tipoMensaje!: string;
  mensaje!: string;
  enabled : boolean | undefined;

  constructor(
    private ruta: ActivatedRoute,
    private router: Router,
    private clienteApiRest: ClienteApiRestService,
    private datos: DataService)
  {this.router.routeReuseStrategy.shouldReuseRoute = () => false;}

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert;

  ngOnInit() {

    this._success.subscribe((message) => (this.successMessage = message));
    this._success.pipe(debounceTime(5000)).subscribe(() => {
			if (this.selfClosingAlert) {
				this.selfClosingAlert.close();
			}
		})

    this.ruta.queryParams
      .subscribe(params => {
      this.enabled = params['enabled'];
    })


    this.getUsers_AccesoResponse();
    }
    getUsers_AccesoResponse() {
    this.clienteApiRest.getAllUsers_ConResponse(this.enabled).subscribe(
    resp =>{
    
    if (resp.status < 400 ) {
    this.Users = resp.body!;
    } else {
    this.mensaje = 'Error al acceder a los datos';
    this.mostrarMensaje = true;
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
    this.mostrarMensaje = true;
    this.mensaje = resp.body; 
    this.getUsers_AccesoResponse();
    } else {
    this.mostrarMensaje = true;
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
      if(EventTarget != null){
        let ischecked = (<HTMLInputElement>event).checked;
        if(ischecked == true){
          this.clienteApiRest.setUserEnabled(String(id)).subscribe({
            next: resp => {
            if (resp.status < 400) {
              console.log("kek");
              this._success.next("Estado del usuario actualizado");
            } else {
            this.mostrarMensaje = true;
            this.mensaje = "Error al activar el usuario";
            }
            },
            error: err=> {
            console.log("Error al activar: " + err.message);
            throw err;
            }}
            )
        }else{
          this.clienteApiRest.setUserDisabled(String(id)).subscribe({
            next: resp => {
            if (resp.status < 400) { 
            this.mostrarMensaje = true;
            this.mensaje = "Usuario desactivado con éxito."; 
            } else {
            this.mostrarMensaje = true;
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

    public changeSuccessMessage(message: string) {
      this._success.next("kekw");
    }

    

}