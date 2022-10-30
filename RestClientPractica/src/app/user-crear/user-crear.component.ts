import { Component, OnInit } from "@angular/core";
import { Role, User } from "../shared/app.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ClienteApiRestService } from "../shared/cliente-api-rest.service";
import { DataService } from "../shared/data.service";

@Component({
  selector: 'app-user-crear',
  templateUrl: './user-crear.component.html',
  styleUrls: ['./user-crear.component.css']
})
export class CrearUserComponent implements OnInit {

  roles= Role;
  mostrarMensaje!: boolean;
  mensaje!: string;

  userVacio = {
    id: 0,
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    enabled: true,
    role: Role.GUEST,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  user = this.userVacio as User;
  id!: String;
  operacion!: String;
  constructor(
    private ruta: ActivatedRoute,
    private router: Router,
    private clienteApiRest: ClienteApiRestService,
    private datos: DataService
  ) {}

  ngOnInit(): void {
    this.mostrarMensaje = false;
    this.mensaje = "";
    
    console.log("En crear-user");

    this.ruta.paramMap.subscribe(
      (params) => {
        this.id = params.get("id")!;
      },
      (err) => console.log("Error al traer id para editar")
    );

  }

  onSubmit():void{
    console.log(this.user);
    console.log("Enviado formulario");
    this.clienteApiRest.anadirUser(this.user).subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.mostrarMensaje = false;
          this.mensaje = "";
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje(resp.body);
        } else {
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje("Error al añadir user");
        }
        this.router.navigate(["users"]);
      },
      (err) => {
        let error = JSON.parse(err.error);
        this.mostrarMensaje = true;
        this.mensaje = error.message;
        console.log("Error al crear: " + error.message);
        throw err;
      }
    );
  }

}
