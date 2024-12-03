import { Component, OnInit } from '@angular/core';
import { AdminProductosService } from 'src/app/services/admin-productos.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'; 


@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {
  categorias: any;
  file: any;
  productoForm!: FormGroup;

  constructor(
    private productosService: AdminProductosService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('token', localStorage.getItem('authToken'));
    this.cargarCategorias();

    this.productoForm = this.formBuilder.group({
      producto_Nombre: ['', Validators.required],
      producto_Descripcion: ['', Validators.required],
      producto_Precio: [null, [Validators.required, Validators.min(0.01)]],
      producto_PrecioPuntos: [null, [Validators.required, Validators.min(1)]],
      id_Categoria: [null, Validators.required],
      producto_Disponible: [null, Validators.required],
      imagen: [null, Validators.required],
    });
  }

   async guardarProducto() {
    if (this.productoForm.invalid) {
      return; 
    }
    const loading = await this.loadingController.create({
      message: 'Guardando producto...',
      spinner: 'crescent',
      cssClass: 'custom-loading' 
    });
    await loading.present();

    const formData = new FormData();
    formData.append('producto_Nombre', this.productoForm.value.producto_Nombre);
    formData.append('producto_Descripcion', this.productoForm.value.producto_Descripcion);
    formData.append('producto_Precio', this.productoForm.value.producto_Precio.toString());
    formData.append('producto_PrecioPuntos', this.productoForm.value.producto_PrecioPuntos.toString());
    formData.append('id_Categoria', this.productoForm.value.id_Categoria.toString());
    formData.append('producto_Disponible', this.productoForm.value.producto_Disponible ? 'true' : 'false');

    if (this.file) {
      formData.append('imagenes', this.file, this.file.name);
    }

    this.productosService.postProduct(formData).subscribe(
      async (data) => {
        await loading.dismiss();
         this.presentAlert(
          'Verificado',
          'El producto ha sido guardado correctamente.',
          'OK',
          () => {
            this.router.navigate(['/productos']);
          }
        );
        console.log('Producto guardado:', data);
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error al guardar el producto:', error);
        this.presentAlert(
          'Error',
          'El producto no se guardó correctamente.',
          'OK',
          () => {
          }
        );
      }
    );
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      this.file = file;
      this.productoForm.patchValue({ imagen: file });
      console.log('Archivo seleccionado:', this.file.name);
    } else {
      console.error('Formato de archivo no soportado');
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
      this.productosService.postCategory({ categoria_Nombre:nombre }).subscribe((data) => {
        this.cargarCategorias();
      });
    } else {
    }
  }

  onDisponibleChange(value: string) {
    this.productoForm.patchValue({ producto_Disponible: value === 'true' });
  }

  imagenArchivo: any;  
  imagenpreview: any;

  almacenarImagen(event: any) {
    const file = event.target.files[0];
    this.imagenArchivo = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenpreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
