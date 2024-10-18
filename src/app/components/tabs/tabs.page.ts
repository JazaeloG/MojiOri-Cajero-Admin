import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async confirmarSalida() {
    const alert = await this.alertController.create({
      header: 'Confirmar Salida',
      message: '¿Estás seguro de que deseas salir?',
      cssClass: 'alert-custom',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button',
          handler: () => {}
        },
        {
          text: 'Salir',
          handler: () => {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
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
