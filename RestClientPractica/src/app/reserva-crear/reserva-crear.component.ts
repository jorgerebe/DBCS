import { Component, Injectable, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Role, Reserva, Status } from '../shared/app.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaApiRestService } from '../shared/reserva-api-rest.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/toast-service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../shared/login/login-service.service';
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : null;
  }
}
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'app-reserva-crear',
  templateUrl: './reserva-crear.component.html',
  styleUrls: ['./reserva-crear.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ReservaCrearComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  pricePerDay:number = 0;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  status = Status;
  mensaje!: string;
  tipoMensaje: string = 'success';

  subscriptionTipo!: Subscription;
  subscriptionMensaje!: Subscription;

  reservaVacia = {
    id: 0,
    guestName: '',
    guestID: 0,
    price: 0,
    units: 1,
    numGuest: 1,
    status: Status.PENDING,
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
    private datos: ToastService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private datePipe: DatePipe,
    private loginService: LoginService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 3);
    
    this.reserva.guestID = loginService.getID() || 0;
    this.reserva.guestName = loginService.getName();
    /*let dateOutNueva = new Date();
    dateOutNueva.setDate(dateOutNueva.getDate()+3);
    this.reserva.dateOut=dateOutNueva;*/

    this.reservaApiRest.getPrice().subscribe((resp) => {
      if (resp.status < 400) {
        this.reserva.price = resp.body || 25;
      }
    });
  }

  today() {
    return this.ngbCalendar.getToday()!;
  }

  ngOnInit(): void {

    this.subscriptionTipo = this.datos.tipoActual.subscribe((valor) => {
      this.tipoMensaje = valor;
    });

    this.subscriptionMensaje = this.datos.mensajeActual.subscribe((valor) => {
      this.mensaje = valor;
      if (this.mensaje.length != 0) {
        this.showToast(this.mensaje, this.tipoMensaje);
      }
    });

    this.ruta.paramMap.subscribe(
      (params) => {
        this.id = params.get('id')!;
      },
      (err) => console.log('Error al traer id para editar')
    );


    this.reservaApiRest.getPrice().subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.datos.cambiarTipo('success');
          this.pricePerDay = (resp.body as number);
          this.actualizarPrecio();
        } else {
          this.datos.cambiarMensaje('Error al añadir reserva');
        }
      },
      (err) => {
        let error = JSON.parse(err.error);
        this.datos.cambiarTipo('danger');
        this.datos.cambiarMensaje(error.message);
        console.log('Error al crear: ' + error.message);
        throw err;
      }
    );

  }

  ngOnDestroy() {
    this.subscriptionMensaje.unsubscribe();
    this.subscriptionTipo.unsubscribe();
  }

  onSubmit(): void {
    if (this.fromDate != null && this.toDate != null) {
      var dIn = new Date(
        this.fromDate?.year,
        this.fromDate?.month - 1,
        this.fromDate?.day
      );
      var dOut = new Date(
        this.toDate?.year,
        this.toDate?.month - 1,
        this.toDate?.day
      );

      console.log(this.datePipe.transform(dOut, 'dd/MM/yyyy'));
      var test = this.datePipe.transform(dIn, 'dd/MM/yyyy') || '';
      var test2 = this.datePipe.transform(dOut, 'dd/MM/yyyy') || '';

      this.reserva.dateIn = test;
      this.reserva.dateOut = test2;
      console.log(this.reserva.dateIn);
      console.log(this.reserva);
      this.reservaApiRest.anadirReserva(this.reserva).subscribe(
        (resp) => {
          if (resp.status < 400) {
            this.datos.cambiarTipo('success');
            this.datos.cambiarMensaje(resp.body);
          } else {
            this.datos.cambiarMensaje('Error al añadir reserva');
          }
          this.router.navigate(['/reservas']);
        },
        (err) => {
          let error = JSON.parse(err.error);
          this.datos.cambiarTipo('danger');
          this.datos.cambiarMensaje(error.message);
          console.log('Error al crear: ' + error.message);
          throw err;
        }
      );
    } else {
      this.datos.cambiarTipo('danger');
      this.datos.cambiarMensaje('Fechas incorrectas.');
    }
  }

  showToast(mensaje: string, tipo: string) {
    this.datos.show(mensaje, { classname: 'bg-' + tipo, delay: 2500 });
  }

  onDateSelection(date: NgbDate) {

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.actualizarPrecio();
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  getID(): Number {
    if (this.reserva.guestID != undefined) {
      return this.reserva.guestID;
    } else {
      return 0;
    }
  }

  actualizarPrecio(){

    var datein = new Date(this.fromDate?.year as number, this.fromDate?.month as number, this.fromDate?.day as number);
    var dateout = new Date(this.toDate?.year as number, this.toDate?.month as number, this.toDate?.day as number);

    var date1:number = (datein.valueOf() as number);
    var date2:number = (dateout.valueOf() as number);

    if(isNaN(date1) || isNaN(date2)){
      return;
    }

    console.log(date2)
    console.log(date1)

    var diff = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    console.log(diff);

    this.reserva.price = this.pricePerDay * diffDays * (this.reserva.units as number); 
  }
}
