import { importProvidersFrom, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = environment.baseApiURL+'registro';
  private apiUrlValidar= environment.baseApiURL+"cuentas/validarCodigo";
  private enviarWA= environment.baseApiURL+"cuentas/enviarCodigo/";


  constructor(private http: HttpClient) { }

  // Método para realizar la solicitud de registro
  registrarUsuario(datosUsuario: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, datosUsuario, { headers });
  }

  enviarWhatsApp(telefono: string): Observable<any> {
    const url = `${this.enviarWA}${telefono}`;
    return this.http.post(url, null);
  }

  validarCodigo(datos: any): Observable<any> {
    return this.http.post(this.apiUrlValidar, datos, { responseType: 'json' });
  }

}
