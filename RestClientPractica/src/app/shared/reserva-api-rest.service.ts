import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Reserva, DateRange, datos } from './app.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ReservaApiRestService {
  private static readonly BASE_URI = 'http://localhost:8000/api/reservas/';
  constructor(private http: HttpClient) {}

  getAllReservas() {
    let url = ReservaApiRestService.BASE_URI;
    return this.http.get<Reserva[]>(url);
  }

  getAllReservas_ConResponse(
    enabled: boolean | undefined
  ): Observable<HttpResponse<Reserva[]>> {
    let url = ReservaApiRestService.BASE_URI;

    console.log(url);

    return this.http.get<Reserva[]>(url, { observe: 'response' });
  }

  anadirReserva(Reserva: Reserva): Observable<HttpResponse<any>> {
    let url = ReservaApiRestService.BASE_URI;
    return this.http.post(url, Reserva, {
      observe: 'response',
      responseType: 'text',
    });
  }

  editarReserva(id: String, Reserva: Reserva): Observable<HttpResponse<any>> {
    let url = ReservaApiRestService.BASE_URI + id;
    return this.http.put(url, Reserva, {
      observe: 'response',
      responseType: 'text',
    });
  }

  getReserva(id: String): Observable<HttpResponse<Reserva>> {
    let url = ReservaApiRestService.BASE_URI + id;
    return this.http.get<Reserva>(url, { observe: 'response' });
  }
  getAvailability(fechas: datos) {
    console.log('SERVICE');
    console.log(JSON.stringify(fechas))

    let url = ReservaApiRestService.BASE_URI + 'availability';
    return this.http.get<number[]>(url, {headers: {'rango': JSON.stringify(fechas)}, observe:'response'});
  }
  
  getPrice(): Observable<HttpResponse<number>> {
    let url = ReservaApiRestService.BASE_URI + 'price';
    return this.http.get<number>(url, { observe: 'response' });
  }
}
