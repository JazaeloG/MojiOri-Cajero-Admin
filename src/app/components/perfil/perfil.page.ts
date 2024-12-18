import { Component, OnInit } from '@angular/core';
import { PerfilService } from 'src/app/services/perfil.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  cajeros: any;
  administradores: any;
  constructor( private perfilService : PerfilService, private router:Router, private alertController: AlertController) { }

  ngOnInit() {
    this.getCuentasCajeros();
    this.getCuentasAdmin();

  }

  getCuentasCajeros() {
    this.perfilService.getCuentasPorRol('CAJERO').subscribe((data: any) => {
      this.cajeros = data;
      console.log(data,  'Cuentas por rol cajero');
    })
  }
  getCuentasAdmin() {
    this.perfilService.getCuentasPorRol('ADMINISTRADOR').subscribe((data: any) => {
      this.administradores = data;
      console.log(data,  'Cuentas por rol admin');
    })
  }

  cerrarSesion() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  deleteCajero(id: number) {
    this.perfilService.deleteCuenta(id).subscribe(
      (data: any) => {
        console.log(data, 'Cajero eliminado');
        this.presentAlert(
          'Cajero eliminado',
          'El cajero ha sido eliminado correctamente.',
          'OK',
          () => {
            this.getCuentasCajeros();
          }
        );
      },
      (error: any) => {
        this.presentAlert(
          'Error',
          'No se ha podido eliminar el cajero.',
          'OK',
          () => {}
        );
      }
    );
  }
  async confirmarDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar ',
      message: '¿Estás seguro de que deseas eliminar al cajero '+ id +'? Esta es una acción irreversible.',
      cssClass: 'alert-custom',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button',
          handler: () => {}
        },
        {
          text: 'Eliminar',
          
          handler: () => {
            this.deleteCajero(id);
          }
        }
      ]
    });

    await alert.present();
    const button = document.querySelector(`.alert-button`);
    if (button) {
      button.setAttribute('style', 'color: #F67704;');
    }
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
}
