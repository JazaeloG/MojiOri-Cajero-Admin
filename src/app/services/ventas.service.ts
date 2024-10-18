import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Product {
  id_Producto: number;
  producto_Nombre: string;
  producto_Precio: string;
  imagenes: { imagenProducto_Url: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient) { }

  descifrarCodigo(qrCode: string): Observable<any> {
    return this.http.post<any>(environment.baseApiURL+'qr-code/decifrar', { data: qrCode });
  }

  obtenerProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.baseApiURL+'productos/obtenerDisponibles');
  }

  realizarVenta(venta: any): Observable<any> {
    return this.http.post<any>(environment.baseApiURL + 'ventas/realizarVenta', venta);
  }

  crearCuentaGenerica(cuenta: any): Observable<any> {
    return this.http.post<any>(environment.baseApiURL + 'registro', cuenta);
  }
}
