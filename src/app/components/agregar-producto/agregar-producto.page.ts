import { Component, OnInit } from '@angular/core';
import { AdminProductosService } from 'src/app/services/admin-productos.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {
  categorias: any;
  file: any;
  idProducto!: number;
  producto: {
    producto_Disponible: boolean;
    producto_Nombre: string;
    producto_Descripcion: string;
    producto_Precio: number;
    producto_PrecioPuntos: number;
    id_Categoria: number,
    imagenes: {
      imagenProducto_Url: string;
    }
  } | undefined 
  

  constructor(
    private productosService: AdminProductosService,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  guardarProducto() {
    if (!this.producto) {
      this.producto = {
        producto_Disponible: false,
        producto_Nombre: '',
        producto_Descripcion: '',
        producto_Precio: 0,
        producto_PrecioPuntos: 0,
        id_Categoria: 0, 
        imagenes: {
          imagenProducto_Url: ''
        }
      };
    }
  
    this.producto.producto_Nombre = (document.querySelector('ion-input[placeholder="Hojaldre"]') as HTMLInputElement).value;
    this.producto.producto_Descripcion = (document.querySelector('ion-input[placeholder="Descripción"]') as HTMLInputElement).value;
    this.producto.producto_Precio = parseFloat((document.querySelector('ion-input[placeholder="15.00"]') as HTMLInputElement).value);
    this.producto.producto_PrecioPuntos = parseFloat((document.querySelector('ion-input[placeholder="200"]') as HTMLInputElement).value);
    this.producto.id_Categoria = Number((document.querySelector('ion-select[placeholder="1"]') as HTMLSelectElement).value);
    this.producto.producto_Disponible = (document.querySelector('ion-select[placeholder="si"]') as HTMLSelectElement).value === 'true';

    if (this.file) {
      // Aquí deberías subir el archivo a tu servidor y obtener la URL
      // Por ejemplo:
      // const imagenUrl = await this.uploadFile(this.file); // método para subir
      // this.producto.imagenes.imagenProducto_Url = imagenUrl; // Asigna la URL de la imagen
    }
  
    console.log('Producto a guardar:', this.producto);
    this.productosService.postProduct(this.producto).subscribe(
      (data) => {
        console.log('Producto guardado:', data);
      },
      (error) => {
        console.error('Error al guardar el producto:', error);
      }
    );
  }
  

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      console.log('Archivo seleccionado:', this.file.name);
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
