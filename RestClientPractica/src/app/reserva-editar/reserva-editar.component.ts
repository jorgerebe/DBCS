import { DatePipe } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Reserva, Status } from '../shared/app.model';

import { ReservaApiRestService } from '../shared/reserva-api-rest.service';
import { ToastService } from '../shared/toast-service';
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
  selector: 'app-reserva-editar',
  templateUrl: './reserva-editar.component.html',
  styleUrls: ['./reserva-editar.component.css'],
})
export class ReservaEditarComponent implements OnInit {
  reservaVacia = {
    id: 0,
    guestName: '',
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
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  status = Status;
  mensaje!: string;
  tipoMensaje: string = 'success';

  subscriptionTipo!: Subscription;
  subscriptionMensaje!: Subscription;

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
    private datePipe: DatePipe
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  today() {
    return this.ngbCalendar.getToday()!;
  }

  ngOnInit() {
    console.log('En editar-reserva');

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

    this.operacion =
      this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path;
    if (this.operacion == 'editar') {
      console.log('En Editar');
      this.ruta.paramMap.subscribe(
        (params) => {
          this.id = params.get('id')!;
        },
        (err) => console.log('Error al leer id para editar: ' + err)
      );

      this.reservaApiRest.getReserva(this.id).subscribe(
        (resp) => {
          this.reserva = resp.body!;
        },
        (err) => {
          console.log('Error al traer la reserva: ' + err.message);
          throw err;
        }
      );
    }
  }

  ngOnDestroy() {
    this.subscriptionMensaje.unsubscribe();
    this.subscriptionTipo.unsubscribe();
  }

  onSubmit() {
    console.log('Enviado formulario');
    if (this.id) {
      this.reservaApiRest
        .editarReserva(String(this.reserva.id), this.reserva)
        .subscribe(
          (resp) => {
            if (resp.status < 400) {
              this.datos.cambiarTipo('success');
              this.datos.cambiarMensaje(resp.body);
              console.log('Reserva editada');
            } else {
              this.datos.cambiarMensaje('Error al modificar la reserva');
            }
            this.router.navigate(['/reservas']);
          },
          (err) => {
            let error = JSON.parse(err.error);
            this.datos.cambiarTipo('danger');
            this.datos.cambiarMensaje(error.message);
            console.log('Error al editar: ' + error.message);
          }
        );
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
}
