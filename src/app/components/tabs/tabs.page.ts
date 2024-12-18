import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.checkUserRole();
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

  checkUserRole() {
    const role = this.loginService.getUserRole(); 
    this.isAdmin = role === 'ADMINISTRADOR'; 
  }


}