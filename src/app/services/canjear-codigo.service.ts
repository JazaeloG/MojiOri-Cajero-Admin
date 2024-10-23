import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CanjearCodigoService {

  constructor(private http: HttpClient) { }

  descifrarCodigo(qrCode: string): Observable<any> {
    return this.http.post<any>(environment.baseApiURL+'qr-code/decifrar-orden', { data: qrCode });
  }

  obtenerOrden(ordenId: number): Observable<any> {
    return this.http.get<any>(environment.baseApiURL+'orden/'+ordenId);
  }
}
