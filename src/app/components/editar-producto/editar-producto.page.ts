import { Component, OnInit } from '@angular/core';
import { AdminProductosService } from 'src/app/services/admin-productos.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.page.html',
  styleUrls: ['./editar-producto.page.scss'],
})
export class EditarProductoPage implements OnInit {
  categorias: any;
  idProducto!: number;
  producto: {
    producto_Disponible: boolean;
    producto_Nombre: string;
    producto_Descripcion: string;
    producto_Precio: number;
    producto_PrecioPuntos: number;
    categoria: {
      id_Categoria: number,
      categoria_Nombre: string
    }
    imagenes: {
      imagenProducto_Url: string;
    }
  } | undefined 
  

  constructor(
    private productosService: AdminProductosService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute

  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idProducto = +params['id'];
    });
    this.cargarCategorias();
    this.getProductoData();
  }

  getProductoData() {
    this.productosService.getProductsById(this.idProducto).subscribe((data:any) => {
      console.log('Datos del producto:', data);
      if (data) {
        this.producto = {

          producto_Disponible: data.producto_Disponible,
          producto_Nombre: data.producto_Nombre,
          producto_Descripcion: data.producto_Descripcion,
          producto_Precio: data.producto_Precio,
          producto_PrecioPuntos: data.producto_PrecioPuntos,
          imagenes: {
            imagenProducto_Url: 'http://desarrollo.mojiorizaba.com:3000/' + data.imagenes[0]?.imagenProducto_Url || 'https://via.placeholder.com/147x139',
          },
          categoria: {
            id_Categoria: data.categoria.id_Categoria,
            categoria_Nombre: data.categoria.categoria_Nombre
          }
        };
      }
    });
  }

  actualizarProducto() {
    if (this.producto) {
      this.productosService.patchProduct(this.idProducto, this.producto).subscribe((data) => {
        console.log('Producto actualizado:', data);
      }); 
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name);
    }
  }

  cargarCategorias() {
    this.productosService.getCategories().subscribe((data) => {
      this.categorias = data;
    });
  }

  async mostrarAlertaGuardarCategoria() {
    const alert = await this.alertController.create({
      header: 'Nueva Categoría',
      inputs: [
        {
          name: 'categoriaNombre',
          type: 'text',
          placeholder: 'Nombre de la categoría',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Guardar',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            this.guardarCategoria(data.categoriaNombre);
          },
        },
      ],
    });

    await alert.present();
  }

  guardarCategoria(nombre: string) {
    if (nombre && nombre.trim() !== '') {
      this.productosService.postCategory({ nombre }).subscribe((data) => {
        this.cargarCategorias();
      });
    } else {
      console.log('Nombre de categoría no válido');
    }
  }
  onDisponibleChange(value: string) {
    if (this.producto) {
      this.producto.producto_Disponible = (value === 'si');
    }
  }
}
