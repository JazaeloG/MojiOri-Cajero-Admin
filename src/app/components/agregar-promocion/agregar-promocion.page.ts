import { Component, OnInit } from '@angular/core';
import { AdminProductosService } from 'src/app/services/admin-productos.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'; 

@Component({
  selector: 'app-agregar-promocion',
  templateUrl: './agregar-promocion.page.html',
  styleUrls: ['./agregar-promocion.page.scss'],
})
export class AgregarPromocionPage implements OnInit {
  productos: any;
  file: any;
  productoForm!: FormGroup;

  constructor(
    private productosService: AdminProductosService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private router: Router,
    private configuracionService: ConfiguracionService
  ) {}

  ngOnInit() {
    console.log('token', localStorage.getItem('authToken'));
    this.cargarproductos();

    this.productoForm = this.formBuilder.group({
      id_Producto: ['', Validators.required],
      promocionProducto_FechaInicio: [null, Validators.required],
      promocionProducto_FechaFin: [null, [Validators.required]],
      promocion_Titulo: [null, [Validators.required]],
      promocion_Descripcion: [null, Validators.required],
      imagen: [null, Validators.required],
    });
  }

   async guardarProducto() {
    if (this.productoForm.invalid) {
      return; 
    }
    const loading = await this.loadingController.create({
      message: 'Guardando promoción...',
      spinner: 'crescent',
      cssClass: 'custom-loading' 
    });
    await loading.present();

    const formData = new FormData();
    formData.append('id_Producto', this.productoForm.value.id_Producto);
    formData.append('promocionProducto_FechaInicio', this.productoForm.value.promocionProducto_FechaInicio);
    formData.append('promocionProducto_FechaFin', this.productoForm.value.promocionProducto_FechaFin);
    formData.append('promocion_Titulo', this.productoForm.value.promocion_Titulo);
    formData.append('promocion_Descripcion', this.productoForm.value.promocion_Descripcion);

    if (this.file) {
      formData.append('imagen', this.file, this.file.name);
    }
    console.log(formData, 'dataa')
    this.configuracionService.postPromociones(formData).subscribe(
      async (data) => {
        await loading.dismiss();
         this.presentAlert(
          'Verificado',
          'La promoción ha sido guardada correctamente.',
          'OK',
          () => {
            this.router.navigate(['/configuracion']);
          }
        );
        console.log('promocion guardada:', data);
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error al guardar el producto:', error);
        this.presentAlert(
          'Error',
          'La promoción no se guardó correctamente.',
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

  cargarproductos() {
    this.productosService.getProducts().subscribe((data) => {
      this.productos = data;
      console.log('productos:', this.productos);
    });
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
