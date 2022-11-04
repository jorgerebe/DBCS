import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ToastService {

	toasts: any[] = [];
	private mensaje = new BehaviorSubject(''); 
	mensajeActual = this.mensaje.asObservable();
	private tipo = new BehaviorSubject('success');
	tipoActual = this.tipo.asObservable();

	show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		this.toasts.push({ textOrTpl, ...options });
	}

	remove(toast: any) {
		this.toasts = this.toasts.filter((t) => t !== toast);
		this.mensaje.next("");
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
		this.mensaje.next("");
	}

	cambiarMensaje(mensaje: string) {
		this.mensaje.next(mensaje);
	}

	cambiarTipo(tipo : string){
		this.tipo.next(tipo);
	}

	size(){
		return this.toasts.length;
	}
}
