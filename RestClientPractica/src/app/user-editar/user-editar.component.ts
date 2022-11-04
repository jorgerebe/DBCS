import { Component, OnInit } from "@angular/core";
import { User } from "../shared/app.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ClienteApiRestService } from "../shared/cliente-api-rest.service";
import { Observable } from "rxjs";
import { Subscription } from 'rxjs';
import { ToastService } from "../toasts/toast-service";
@Component({
  selector: "app-user-editar",
  templateUrl: "./user-editar.component.html",
  styleUrls: ["./user-editar.component.css"],
})
export class EditarUserComponent implements OnInit {
  userVacio = {
    id: 0,
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    enabled: false,
    role: "Host",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  subscriptionTipo !: Subscription;
  subscriptionMensaje! : Subscription;

  user = this.userVacio as User;
  id!: String;
  tipoMensaje!: string;
  mensaje!: string;
  operacion!: String;
  constructor(
    private ruta: ActivatedRoute,
    private router: Router,
    private clienteApiRest: ClienteApiRestService,
    private datos: ToastService
  ) {}
  ngOnInit() {
    console.log("En editar-user");
    this.datos.clear();

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

    this.operacion =
      this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path;
    if (this.operacion == "editar") {
      console.log("En Editar");
      this.ruta.paramMap.subscribe(
        (params) => {
          this.id = params.get("id")!;
        },
        (err) => console.log("Error al leer id para editar: " + err)
      );

      this.clienteApiRest.getUser(this.id).subscribe(
        (resp) => {
          this.user = resp.body!;
        },
        (err) => {
          console.log("Error al traer el user: " + err.message);
          throw err;
        }
      );
    }
  }

  ngOnDestroy(){
    this.subscriptionMensaje.unsubscribe();
    this.subscriptionTipo.unsubscribe();
   }

  onSubmit() {
    console.log("Enviado formulario");
    if (this.id) {
      this.clienteApiRest
        .editarUser(String(this.user.id), this.user)
        .subscribe(
          (resp) => {
            if (resp.status < 400) {
              this.datos.cambiarTipo("success");
              this.datos.cambiarMensaje(resp.body);
              console.log("Usuario editado")
            } else {
              this.datos.cambiarMensaje("Error al modificar comentario");
            }
            this.router.navigate(["/users"]);
          },
          (err) => {
            let error = JSON.parse(err.error);
            this.datos.cambiarTipo("danger")
            this.datos.cambiarMensaje(error.message);
            console.log("Error al editar: " + error.message);
          }
        );
    }
  }

  showToast(mensaje : string, tipo:string) {
    this.datos.show(mensaje, {classname : 'bg-' + tipo, delay:2500});
  }


}
