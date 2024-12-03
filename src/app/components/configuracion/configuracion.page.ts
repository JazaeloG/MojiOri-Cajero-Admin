import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { AdminProductosService } from 'src/app/services/admin-productos.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular'; 

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  promociones: any;
  promocionesActivas: any;
  displayedPromociones: any[] = [];
  selectedImage: File | null = null;
  isEditing: boolean = false; 
  percentage: number | null = null; 
  constructor( private configuracionService: ConfiguracionService, private productos: AdminProductosService,     private alertController: AlertController,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.getPromociones();
    this.getPromocionesActivas();
  }

  getPromociones(){
    this.configuracionService.getPromociones().subscribe((res: any) => {
      console.log('promociones',res);
      this.promociones = res;
      this.displayedPromociones = this.promociones;

    });
  }
  getPromocionesActivas(){
    this.configuracionService.getPromocionesActivas().subscribe((res: any) => {
      console.log('promociones activas ',res);
      this.promocionesActivas = res;
    });
  }

  segmentChanged(event: any) {
    const selectedValue = event.detail.value;

    if (selectedValue === 'todas') {
      this.displayedPromociones = this.promociones;
      console.log('todas');
    } else if (selectedValue === 'activas') {
      this.displayedPromociones = this.promocionesActivas;
      console.log('activas');
    };
  }

  async deletePromocion(id: number){
    const loading = await this.loadingController.create({
      message: 'Guardando producto...',
      spinner: 'crescent',
      cssClass: 'custom-loading' 
    });
    await loading.present();

    this.configuracionService.deletePromocion(id).subscribe(async (res: any) => {
      console.log(res);
      await loading.dismiss();
      this.presentAlert(
        'Eliminado',
        'El producto ha sido eliminado correctamente.',
        'OK',
        () => {
          this.getPromociones();
          this.getPromocionesActivas();
        },
      );
    },
    async (error) => {;
      await loading.dismiss();
      this.presentAlert(
        'Error',
        'El producto no se eliminó correctamente.',
        'OK',
        () => {
        }
      );
      console.error('Error al guardar el producto:', error);
     
  });

  }
  async alertaEliminarProducto(id: number, promocion_Titulo: string) {
    const alert = await this.alertController.create({
      header:
        '¿Desea eliminar la promoción "'  + promocion_Titulo+  '" de la lista de promociones?',
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
            this.deletePromocion(id);
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
 // Inicia la edición
 startEditing() {
  this.isEditing = true;
}

// Guarda la configuración
saveConfig() {
  console.log('Configuración guardada:', this.percentage);
  this.isEditing = false;
}

// Cancela la edición
cancelEdit() {
  this.percentage = null; 
  this.isEditing = false;
}
}