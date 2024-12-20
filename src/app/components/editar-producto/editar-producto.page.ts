import { Component, OnInit } from '@angular/core';
import { AdminProductosService } from 'src/app/services/admin-productos.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.page.html',
  styleUrls: ['./editar-producto.page.scss'],
})
export class EditarProductoPage implements OnInit {
  categorias: any;
  idProducto!: number;
  producto:
    | {
        producto_Disponible: boolean;
        producto_Nombre: string ;
        producto_Descripcion: string;
        producto_Precio: number;
        producto_PrecioPuntos: number;
        id_Categoria: number;
        categoria_Nombre: string;
        imagenes: {
          imagenProducto_Url: string;
        };
      }= {
        id_Categoria: 0,
        producto_Disponible: true,
        producto_Nombre: '',
        producto_Descripcion: '',
        producto_Precio: 0,
        producto_PrecioPuntos: 0,
        imagenes: { imagenProducto_Url: '' },
        categoria_Nombre: '',
      };
    
  patchProducto: any;
  archivo:
    | {
        id: number;
        nombre: string;
        imagen: string;
      }
    | undefined;

  constructor(
    private productosService: AdminProductosService, private alertController: AlertController, private loadingController: LoadingController, private activatedRoute: ActivatedRoute, private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.idProducto = +params['id'];
    });
    this.cargarCategorias();
    this.getProductoData();
  }

  getProductoData() {
    this.productosService
      .getProductsById(this.idProducto)
      .subscribe((data: any) => {
        if (data) {
          this.producto = {
            producto_Disponible: data.producto_Disponible,
            producto_Nombre: data.producto_Nombre,
            producto_Descripcion: data.producto_Descripcion,
            producto_Precio: data.producto_Precio,
            producto_PrecioPuntos: data.producto_PrecioPuntos,
            imagenes: {
              imagenProducto_Url:
                'https://mojiorizaba.com/' +
                  data.imagenes[data.imagenes.length - 1]?.imagenProducto_Url ||
                'https://via.placeholder.com/147x139',
            },
            id_Categoria: data.categoria.id_Categoria,
            categoria_Nombre: data.categoria.categoria_Nombre,
          };
        }
      });
  }

  async actualizarProducto() {
    this.patchProducto = {
      producto_Disponible: this.producto?.producto_Disponible,
      producto_Nombre: this.producto?.producto_Nombre,
      producto_Descripcion: this.producto?.producto_Descripcion,
      producto_Precio: this.producto?.producto_Precio,
      producto_PrecioPuntos: this.producto?.producto_PrecioPuntos,
      id_Categoria: this.producto?.id_Categoria,
    };
  
    console.log('patchProducto', this.patchProducto);
  
    if (this.patchProducto) {
      const loading = await this.loadingController.create({
        message: 'Guardando producto...',
        spinner: 'crescent',
        cssClass: 'custom-loading',
      });
      await loading.present();
  
      this.productosService.patchProduct(this.idProducto, this.patchProducto).subscribe(
        async (data) => {
          await loading.dismiss();
          console.log('Producto actualizado:', data);
          this.presentAlert(
            'Actualizado',
            'El producto ha sido actualizado correctamente.',
            'OK',
            () => {
              this.router.navigate(['/productos']);
            }
          );
        },
        async (error) => {
          await loading.dismiss();
          console.error('Error al actualizar el producto:', error);
          this.presentAlert(
            'Error',
            'El producto no se actualizó correctamente.',
            'OK',
            () => {}
          );
        }
      );
    }
  }
  


  async eliminarProducto() {
    console.log(this.idProducto);
    const loading = await this.loadingController.create({
      message: 'Eliminando producto...',
      spinner: 'crescent',
      cssClass: 'custom-loading',
    });
    await loading.present();
    this.productosService.deleteProduct(this.idProducto).subscribe(async () => {
      await loading.dismiss();
      console.log(`Producto con ID ${this.idProducto} eliminado.`);
      this.router.navigate(['/productos']);
    },
     async (error) => {
      await loading.dismiss();
      console.error('Error al eliminar el producto:', error);
      this.presentAlert(
        'Error',
        'El producto no se eliminó correctamente.',
        'OK',
        () => {
        }
      );
    }
  );
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
  async alertaEliminarProducto() {
    const alert = await this.alertController.create({
      header:
        '¿Desea eliminar ' +
        this.producto?.producto_Nombre +
        ' de la lista de productos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Eliminar',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            this.eliminarProducto();
          },
        },
      ],
    });

    await alert.present();
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
  private async presentAlert(
    header: string,
    message: string,
    buttonText: string,
    handler: () => void
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: buttonText,
          handler,
          cssClass: 'alert-button',
        },
      ],
    });

    await alert.present();
    const button = document.querySelector(`.alert-button`);
    if (button) {
      button.setAttribute('style', 'color: #F67704;');
    }
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
      this.producto.producto_Disponible = value === 'si';
    }
  }
}
