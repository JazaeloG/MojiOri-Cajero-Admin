import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
    url= environment.baseApiURL ;
  constructor(private http: HttpClient) { }

  postPromociones(formData: FormData) {  
    const headers = new HttpHeaders({
    });
    return this.http.post(`${this.url}promociones`, formData, { headers });  }

  getPromociones() {
    return this.http.get(`${this.url}promociones`);
  }
  getPromocionesActivas() {
    return this.http.get(`${this.url}promociones/obtenerActivas`);
  }
  getPromocionId(id: number) {
    return this.http.get(`${this.url}promociones/obtenerPorID/${id}`);
  }
  deletePromocion(id: number): Observable<any> {
    return this.http.delete(`${this.url}promociones/${id}`);
  }

  postConfiguracion(config: any) {
    return this.http.post(`${this.url}configuracion`, config);
  }
  
  getConfiguracion(){
    return this.http.get(`${this.url}configuracion`);
  }
}

