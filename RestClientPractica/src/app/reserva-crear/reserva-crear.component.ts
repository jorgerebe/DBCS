import { Component, OnInit } from '@angular/core';
import { Role, Reserva, Status } from "../shared/app.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ReservaApiRestService } from "../shared/reserva-api-rest.service";
import { Subscription } from "rxjs";
import { ToastService } from "../shared/toast-service";
@Component({
  selector: 'app-reserva-crear',
  templateUrl: './reserva-crear.component.html',
  styleUrls: ['./reserva-crear.component.css']
})
export class ReservaCrearComponent implements OnInit {


  status= Status;
  mensaje!: string;
  tipoMensaje: string = "success";

  subscriptionTipo !: Subscription;
  subscriptionMensaje! : Subscription;

  reservaVacia = {
    id: 0,
    guestName: "",
    guestID: 0,
    price: 0.0,
    units: 0,
    numGuest: 0,
    status: Status.CONFIRMED,
    dateIn: new Date(),
    dateOut: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  reserva = this.reservaVacia as Reserva;
  id!: String;
  operacion!: String;
  constructor(
    private ruta: ActivatedRoute,
    private router: Router,
    private reservaApiRest: ReservaApiRestService,
    private datos: ToastService
  ) {}

  ngOnInit(): void {
    

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
    console.log("Enviado formulario");
    this.reservaApiRest.anadirReserva(this.reserva).subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.datos.cambiarTipo("success");
          this.datos.cambiarMensaje(resp.body);
        } else {
          this.datos.cambiarMensaje("Error al añadir reserva");
        }
        this.router.navigate(["/reservas"]);
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
