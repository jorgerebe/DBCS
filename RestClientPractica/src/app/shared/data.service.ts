import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
@Injectable({ providedIn: 'root' })
export class DataService {


private mensaje = new BehaviorSubject('Lista de Usuarios'); 

mensajeActual = this.mensaje.asObservable();
private mostrarMensaje = new BehaviorSubject<boolean>(false);
mostrarMensajeActual = this.mostrarMensaje.asObservable();
constructor() { }

cambiarMensaje(mensaje: string) {
this.mensaje.next(mensaje);
}
cambiarMostrarMensaje(valor: boolean) {
this.mostrarMensaje.next(valor);
}
}