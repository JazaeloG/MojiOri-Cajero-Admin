import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminProductosService {
  ulr: string = environment.baseApiURL;
  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(`${this.ulr}productos`);
  }
  getProductsById(id: number) {
    return this.http.get(`${this.ulr}productos/obtenerPorID/${id}`);
  }

  postProduct(data: any) {  
    return this.http.post(`${this.ulr}productos`, data);
  }

  patchProduct(id: number,data: any) {
    return this.http.patch(`${this.ulr}productos/${id} `, data);
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
  
}
