import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { User } from './app.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ClienteApiRestService {

    private static readonly BASE_URI = 'http://localhost:8080/users/';
    constructor(private http: HttpClient) { } // inyectamos el servicio HttpClient
    // Ejemplo de llamada retornando el cuerpo de la respuesta

    getAllUsers() {
        console.log("dentro de getAllUsers");
        let url = ClienteApiRestService.BASE_URI;
        return this.http.get<User[]>(url); // Retorna el cuerpo de la respuesta
    }

    // Ejemplo de llamada retornando toda la respuesta
    getAllUsers_ConResponse(enabled:boolean|undefined): Observable<HttpResponse<User[]>> {
        let url = ClienteApiRestService.BASE_URI;

        if(enabled !== undefined){
            url = url.substring(0, url.length-1) + "\?enabled" + "=" + enabled;
        }

        console.log(url);

        return this.http.get<User[]>(url, { observe: 'response' });
    }

    borrarUser(id: String): Observable<HttpResponse<any>> {
        let url = ClienteApiRestService.BASE_URI + id;
        return this.http.delete(url, { observe: 'response', responseType: 'text'});
    }

    anadirUser(user: User): Observable<HttpResponse<any>> {
        let url = ClienteApiRestService.BASE_URI;
        return this.http.post(url, user, { observe: 'response', responseType: 'text'});
    }

    editarUser(id: String, user: User): Observable<HttpResponse<any>> {
        let url = ClienteApiRestService.BASE_URI + id;
        console.log("enviando mensaje api");
        return this.http.put(url, user, { observe: 'response', responseType: 'text'});
    }

    getUser(id: String): Observable<HttpResponse<User>> {
        let url = ClienteApiRestService.BASE_URI + id;
        return this.http.get<User>(url, { observe: 'response' });
    }

    setUserDisabled(ids: String[]): Observable<HttpResponse<any>>{
        let url = ClienteApiRestService.BASE_URI + "disable?user_id=";

        ids.forEach(id => {
                    url += id + ",";
        });

        url = url.substring(0, url.length-1);

        console.log(url);
        return this.http.put(url, {},  {observe: 'response', responseType: 'text'});
    }

    setUserEnabled(ids: String[]): Observable<HttpResponse<any>>{
        let url = ClienteApiRestService.BASE_URI + "enable?user_id=";

        ids.forEach(id => {
                    url += id + ",";
        });

        url = url.substring(0, url.length-1);

        console.log(url);
        return this.http.put(url, {},  {observe: 'response', responseType: 'text'});
    }
}