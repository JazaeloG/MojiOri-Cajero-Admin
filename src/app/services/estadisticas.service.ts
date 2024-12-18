import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  url= environment.baseApiURL ;
  constructor(private http: HttpClient) { }

  getProductosMasVendidos(fechaInicio: string, fechaFin: string, limite: number): Observable<any> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('limite', limite.toString());

    return this.http.get(`${this.url}ventas/productosMasVendidos`, { params });
  }

  getComparacionVentas(params: {
    fechaInicioPeriodo1: string;
    fechaFinPeriodo1: string;
    fechaInicioPeriodo2: string;
    fechaFinPeriodo2: string;
    tipoAgrupacion: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.url}ventas/comparacion`, { params });
  }

  getTicketPromedio(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.get(`${this.url}ventas/ticketPromedio/`, { params });
  }
}
