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
  porcentaje_puntos: any = {};
  categorias: any;
    constructor( private configuracionService: ConfiguracionService, private productos: AdminProductosService,     private alertController: AlertController,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.getPromociones();
    this.getConfiguracion();
    this.getPromocionesActivas();
    this.getCategorias();
  }

  getPromociones(){
    this.configuracionService.getPromociones().subscribe((res: any) => {
      this.promociones = res;
      this.displayedPromociones = this.promociones;
      console.log( this.promociones)
    });
  }
  getPromocionesActivas(){
    this.configuracionService.getPromocionesActivas().subscribe((res: any) => {
      this.promocionesActivas = res;
    });
  }
  getConfiguracion(){
    this.configuracionService.getConfiguracion().subscribe((res: any) => {
      this.porcentaje_puntos = res[res.length - 1];
      console.log(this.porcentaje_puntos);
    });
  }
  getCategorias(){
    this.productos.getCategories().subscribe((res: any) => {
      this.categorias = res;
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
      message: 'Eliminando promocion...',
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
  async alertaEliminarPromocion(id: number, promocion_Titulo: string) {
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

  async mostrarPromocion(promocion: any) {
    const alert = await this.alertController.create({
      header: promocion.promocion.promocion_Titulo,
      subHeader: promocion.promocion.promocion_Descripcion,
      message:`Válido del ${promocion.promocionProducto_FechaInicio} al ${promocion.promocionProducto_FechaFin}`,
      buttons: [ {
        text: 'Cerrar',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
      },],
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
async saveConfig() {
  const loading = await this.loadingController.create({
    message: 'Guardando configuración...',
    spinner: 'crescent',
    cssClass: 'custom-loading',
  });

  await loading.present();

  const configuracionBody = {
    configuracion_Clave: 'puntos_porcentaje',
    configuracion_Valor: this.porcentaje_puntos.configuracion_Valor.toString(),
    configuracion_Descripcion: 'Porcentaje de puntos para promociones',
  };

  console.log('Enviando datos al backend:',  this.porcentaje_puntos.valor);

  this.configuracionService.postConfiguracion(configuracionBody).subscribe(
    async (res: any) => {
      console.log('Respuesta del servidor:', res);
      await loading.dismiss();
      this.presentAlert(
        'Guardado',
        'La configuración se ha guardado correctamente.',
        'OK',
        () => {
          this.isEditing = false;
        }
      );
    },
    async (error) => {
      console.error('Error al guardar la configuración:', error);
      await loading.dismiss();
      this.presentAlert(
        'Error',
        'No se pudo guardar la configuración. Intente nuevamente.',
        'OK',
        () => {}
      );
    }
  );
}


cancelEdit() {
  this.getConfiguracion(); // Recarga la configuración original
  this.isEditing = false; // Finaliza el modo de edición
}


}
