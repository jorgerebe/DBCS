import { Component, OnInit } from "@angular/core";
import { Role, User } from "../shared/app.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ClienteApiRestService } from "../shared/cliente-api-rest.service";
import { DataService } from "../shared/data.service";
import { ToastService } from "../toasts/toast-service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-user-crear',
  templateUrl: './user-crear.component.html',
  styleUrls: ['./user-crear.component.css']
})
export class CrearUserComponent implements OnInit {

  roles= Role;
  mensaje!: string;
  tipoMensaje: string = "success";

  subscriptionTipo !: Subscription;
  subscriptionMensaje! : Subscription;

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
    private datos: ToastService
  ) {}

  ngOnInit(): void {
    
    console.log("En crear-user");

    this.subscriptionTipo = this.datos.tipoActual.subscribe(
      valor => {
        this.tipoMensaje=valor;
      }
    )

    this.subscriptionMensaje = this.datos.mensajeActual.subscribe(
      valor => {
        this.mensaje=valor;
        if(this.mensaje.length != 0){
          this.showToast(this.mensaje, this.tipoMensaje);
        }
      }
    );

    this.ruta.paramMap.subscribe(
      (params) => {
        this.id = params.get("id")!;
      },
      (err) => console.log("Error al traer id para editar")
    );

  }

  ngOnDestroy(){
    this.subscriptionMensaje.unsubscribe();
    this.subscriptionTipo.unsubscribe();
  }

  onSubmit():void{
    console.log(this.user);
    console.log("Enviado formulario");
    this.clienteApiRest.anadirUser(this.user).subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.datos.cambiarTipo("success");
          this.datos.cambiarMensaje(resp.body);
        } else {
          this.datos.cambiarMensaje("Error al añadir user");
        }
        this.router.navigate(["/users"]);
      },
      (err) => {
        let error = JSON.parse(err.error);
        this.datos.cambiarTipo("danger")
        this.datos.cambiarMensaje(error.message);
        console.log("Error al crear: " + error.message);
        throw err;
      }
    );
  }

  showToast(mensaje : string, tipo:string) {
    this.datos.show(mensaje, {classname : 'bg-' + tipo, delay:2500});
  }

}
