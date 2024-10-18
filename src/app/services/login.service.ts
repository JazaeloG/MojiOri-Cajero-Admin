import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginURL = environment.baseApiURL + 'login';
  private profileURL = environment.baseApiURL + 'login/obtener-perfil';
  constructor(private http: HttpClient) { }

  login(cuenta_Telefono: string, cuenta_Contrasena: string): Observable<any> {
    const body = { cuenta_Telefono, cuenta_Contrasena };
    return this.http.post<any>(this.loginURL, body).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
      }),
      map(response => response.token ? { success: true, token: response.token } : { success: false, error: 'Credenciales incorrectas' }),
      catchError(error => {
        console.error('Error en el login', error);
        return of({ success: false, error: 'Error en el servidor' });
      })
    );
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(this.profileURL, { headers }).pipe(
      map(profile => {
        const rolesPermitidos = ['ADMINISTRADOR', 'CAJERO'];
        return rolesPermitidos.includes(profile.cuenta_Rol) ? profile : null;
      }),
      catchError(error => {
        console.error('Error al obtener el perfil', error);
        return of(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}