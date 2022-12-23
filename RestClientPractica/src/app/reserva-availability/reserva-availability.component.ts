import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Availability, DateRange, datos } from '../shared/app.model';
import { ReservaApiRestService } from '../shared/reserva-api-rest.service';

@Component({
  selector: 'app-reserva-availability',
  templateUrl: './reserva-availability.component.html',
  styleUrls: ['./reserva-availability.component.css']
})
export class ReservaAvailabilityComponent implements OnInit {

  Availabilities: Availability[] = [];

  fechas : datos = {
    dateIn: [0,0,0],
    dateOut: [0,0,0],
  }

  dates : DateRange = {
    dateIn : new Date(),
    dateOut : new Date()
  }

  dayOffset = 15;
  millisecondOffset = this.dayOffset * 24 * 60 * 60 * 1000;

  /*dateInNumber : number = new Date().getDate();
  dateOutNumber:number = new Date().getDate() + 15;*/

  constructor(private router:Router, public datepipe: DatePipe, private reservaApiRest: ReservaApiRestService) { }

  ngOnInit(): void {
    this.dates.dateOut = this.addDays(this.dates.dateOut, 15);
    this.actualizarDisponibilidad();  
  }

  actualizarDisponibilidad(){

    this.fechas.dateIn = [this.dates.dateIn.getFullYear(), this.dates.dateIn.getMonth()+1, this.dates.dateIn.getDate()];
    this.fechas.dateOut = [this.dates.dateOut.getFullYear(), this.dates.dateOut.getMonth()+1, this.dates.dateOut.getDate()];

    console.log(this.fechas);

    var currentDate:Date = this.addDays(this.dates.dateIn, 0);

    this.reservaApiRest.getAvailability(this.fechas).subscribe(
      (resp) => {
        if (resp.status < 400) {
          let nRooms : number[] = resp.body!;


          for (let i = 0; i < nRooms?.length; i++) {
            let availability:Availability = {day:0, month:0, year:0, nRooms:0};
            availability.day = currentDate.getDate();
            availability.month = currentDate.getMonth()+1;
            availability.year = currentDate.getFullYear();
            availability.nRooms = nRooms[i];
            this.Availabilities.push(availability);

            currentDate.setDate(currentDate.getDate()+1);
          }

          console.log(this.Availabilities);

        } else {
          this.router.navigate(['/reservas']);
        }
      },
      (err) => {
        let error = JSON.parse(err.error);
        console.log('Error al obtener disponibilidad: ' + error.message);
        throw err;
      }
    );
  }

  verSiguientes(){
    this.Availabilities = [];

    this.dates.dateIn = this.addDays(this.dates.dateIn, 15);
    this.dates.dateOut = this.addDays(this.dates.dateOut, 15);

    this.actualizarDisponibilidad();
  }

  verAnteriores(){
    this.Availabilities = [];

    this.dates.dateIn = this.addDays(this.dates.dateIn, -15);
    this.dates.dateOut = this.addDays(this.dates.dateOut, -15);

    this.actualizarDisponibilidad();
  }

  addDays(date:Date, days:number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  encimaLimiteInferior(){
    return this.dates.dateIn.getTime() > new Date().getTime();
  }

}
