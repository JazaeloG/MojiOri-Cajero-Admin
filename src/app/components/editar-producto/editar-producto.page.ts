import { Component, OnInit } from '@angular/core';
import { AdminProductosService } from 'src/app/services/admin-productos.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';


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
    id_Categoria: number,
    categoria_Nombre: string;
    imagenes: {
      imagenProducto_Url: string;
    }
  } | undefined 
  patchProducto: any;
  archivo: {
    id: number;
    nombre: string;
    imagen: string;
  } | undefined

  constructor(
    private productosService: AdminProductosService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
      if (data) {
        this.producto = {
          producto_Disponible: data.producto_Disponible,
          producto_Nombre: data.producto_Nombre,
          producto_Descripcion: data.producto_Descripcion,
          producto_Precio: data.producto_Precio,
          producto_PrecioPuntos: data.producto_PrecioPuntos,
          imagenes: {
            imagenProducto_Url: 'http://desarrollo.mojiorizaba.com:3000/' + data.imagenes[data.imagenes.length - 1]?.imagenProducto_Url || 'https://via.placeholder.com/147x139',
          },
          id_Categoria: data.categoria.id_Categoria,
          categoria_Nombre: data.categoria.categoria_Nombre
        };
      }
    });
  }

  async actualizarProducto() {
    await this.actualizarInputs();

    if (this.patchProducto) {
      this.productosService.patchProduct(this.idProducto, this.patchProducto).subscribe((data) => {
        console.log('Producto actualizado:', data);
        this.presentAlert(
          'Actualizado',
          'El producto ha sido actualizado correctamente.',
          'OK',
          () => {
            this.router.navigate(['/productos']);
          }
        );
      }); 
    }
  }

  eliminarProducto() {
    console.log(this.idProducto);
    this.productosService.deleteProduct(this.idProducto).subscribe(() => {
      console.log(`Producto con ID ${this.idProducto} eliminado.`);
      this.router.navigate(['/productos']);
    });
  }
  
actualizarInputs() {
  this.patchProducto = {
    producto_Disponible: (document.querySelector('ion-select[placeholder="si"]') as HTMLSelectElement).value,
    producto_Nombre: (document.querySelector('ion-input[placeholder="Hojaldre"]') as HTMLInputElement).value,
    producto_Descripcion: (document.querySelector('ion-input[placeholder="Descripción"]') as HTMLInputElement).value,
    producto_Precio: parseFloat((document.querySelector('ion-input[placeholder="15.00"]') as HTMLInputElement).value),
    producto_PrecioPuntos: parseFloat((document.querySelector('ion-input[placeholder="200"]') as HTMLInputElement).value),
    id_Categoria: Number((document.querySelector('ion-select[placeholder="1"]') as HTMLSelectElement).value),
  }
  console.log('patchProducto', this.patchProducto);
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
      header: '¿Desea eliminar '+this.producto?.producto_Nombre +' de la lista de productos?',
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
      this.producto.producto_Disponible = (value === 'si');
    }
  }
}
