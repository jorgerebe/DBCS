import { Component, OnInit } from "@angular/core";
import { User } from "../shared/app.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ClienteApiRestService } from "../shared/cliente-api-rest.service";
import { Observable } from "rxjs";
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
  user = this.userVacio as User;
  id!: String;
  operacion!: String;
  constructor(
    private ruta: ActivatedRoute,
    private router: Router,
    private clienteApiRest: ClienteApiRestService,
    private datos: ToastService
  ) {}
  ngOnInit() {
    console.log("En editar-user");

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

  onSubmit() {
    console.log("Enviado formulario");
    if (this.id) {
      this.clienteApiRest
        .editarUser(String(this.user.id), this.user)
        .subscribe(
          (resp) => {
            if (resp.status < 400) {
              this.datos.cambiarMensaje(resp.body);
              console.log("rekek")
            } else {
              this.datos.cambiarMensaje("Error al modificar comentario");
            }
            this.router.navigate(["users"]);
          },
          (err) => {
            console.log("Error al editar: " + err.message);
            throw err;
          }
        );
    }
  }


}
