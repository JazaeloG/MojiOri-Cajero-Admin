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
          
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(error => {
        console.error('Error en el login', error);
        return of(null);
      })
    );
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(this.profileURL, { headers }).pipe(
      map(profile => {
        const rolPermitido = ['ADMINISTRADOR', 'CAJERO'];
        if (rolPermitido.includes(profile.cuenta_Rol)) {
          return profile;
        } else {
          console.error('Rol no permitido');
          return null;
        }
      }),
      catchError(error => {
        console.error('Error al obtener el perfil', error);
        return of(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
