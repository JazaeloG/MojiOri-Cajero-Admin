import { Component, OnInit } from '@angular/core';
import { last } from 'rxjs';
import { AdminProductosService } from 'src/app/services/admin-productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: any;
  constructor( private productosService: AdminProductosService) { }

  ngOnInit() {
    this.productosService.getProducts().subscribe((res: any) => {
      this.productos =res.map((producto: any) => ({  
        id: producto.id_Producto,
        nombre: producto.producto_Nombre,
        precio: producto.producto_Precio,
        img : 'http://desarrollo.mojiorizaba.com:3000/' + producto.imagenes[producto.imagenes.length - 1]?.imagenProducto_Url || 'https://via.placeholder.com/147x139'
      }));
    });
  }

}
