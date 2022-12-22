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

  dateInNumber : number = new Date().getDate();
  dateOutNumber:number = new Date().getDate() + 15;

  constructor(private router:Router, public datepipe: DatePipe, private reservaApiRest: ReservaApiRestService) { }

  ngOnInit(): void {
    this.actualizarDisponibilidad();  
  }

  actualizarDisponibilidad(){

    this.dates.dateIn.setDate(this.dateInNumber);
    this.dates.dateOut.setDate(this.dateOutNumber);

    this.fechas.dateIn = [this.dates.dateIn.getFullYear(), this.dates.dateIn.getMonth()+1, this.dates.dateIn.getDate()];
    this.fechas.dateOut = [this.dates.dateOut.getFullYear(), this.dates.dateOut.getMonth()+1, this.dates.dateOut.getDate()];

    console.log(this.fechas);

    var currentDate:Date = this.dates.dateIn;

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
    this.dateInNumber += 15;
    this.dateOutNumber += 15;
    this.actualizarDisponibilidad();
  }

  verAnteriores(){
    this.Availabilities = [];

    this.dateInNumber -= 15;
    this.dateOutNumber -= 15;

    this.actualizarDisponibilidad();
  }

}
