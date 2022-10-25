import { Component, OnInit } from '@angular/core';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';
import { User} from '../shared/app.model';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-user-listar',
  templateUrl: './user-listar.component.html',
  styleUrls: ['./user-listar.component.css']
})
export class UserListarComponent implements OnInit {
  Users!: User[];
  mostrarMensaje!: boolean;
  mensaje!: string;
  // Inyectamos los servicios
  constructor( private clienteApiRest: ClienteApiRestService, private datos: DataService)
  { }

  ngOnInit() {


    this.getUsers_AccesoResponse();
    }
    getUsers_AccesoResponse() {
    this.clienteApiRest.getAllUsers_ConResponse().subscribe(
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

}