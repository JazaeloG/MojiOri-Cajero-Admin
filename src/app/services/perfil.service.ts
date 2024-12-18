import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  url = environment.baseApiURL + 'cuentas/obtenerPorRol/'
  url2 = environment.baseApiURL + 'registro/registrarAdministrativo'
  constructor(private http: HttpClient) { }

  getCuentasPorRol(rol: string) {
    return this.http.get(this.url + rol)
  }

  registarCuentaAdmin(cuenta: any) {
    return this.http.post(environment.baseApiURL + 'cuentas/registrarCuentaAdmin', cuenta)
  }
  registrarUsuario(datosUsuario: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.url2, datosUsuario, { headers });
  }
  deleteCuenta(id: number) {
    return this.http.delete(environment.baseApiURL + 'cuentas/' + id)
  }
}
