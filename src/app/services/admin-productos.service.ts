import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProductosService {
  ulr: string = environment.baseApiURL;
  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(`${this.ulr}productos/obtenerDisponibles`);
  }
  getProductsById(id: number) {
    return this.http.get(`${this.ulr}productos/obtenerPorID/${id}`);
  }

  postProduct(formData: FormData) {  
    const headers = new HttpHeaders({
    });
    return this.http.post(`${this.ulr}productos`, formData, { headers });  }

  patchProduct(id: number,data: any) {
    return this.http.patch(`${this.ulr}productos/${id} `, data);
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.ulr}productos/${id}`);
  }



  postCategory(data: any) {
    console.log('dattaaa service',data);
    this.http.post(`${this.ulr}categorias`, data).subscribe(response => {
      console.log('dattaaa service', response);
    });

    return this.http.post(`${this.ulr}categorias`, data);
  }

  getCategories() {
    return this.http.get(`${this.ulr}categorias`);
  }
  
  imageUpload(data: any) {
    return this.http.post(`${this.ulr}imagen-producto`, data);
  }
}
