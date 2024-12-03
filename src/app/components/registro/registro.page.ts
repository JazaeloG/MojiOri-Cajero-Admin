import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { LoadingController } from '@ionic/angular'; 
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup;
  showDateTime: boolean = false;
  selectedDate: string = '';
  formattedDate: string = '';
  datosUsuario: any = {};

  constructor(private fb: FormBuilder, private registroService: PerfilService, private router: Router,     private alertController: AlertController,
    private loadingController: LoadingController,) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      "usuario_Usuario": ["", Validators.required],
      "cuenta_Contrasena": ["", [Validators.required, Validators.minLength(8)]],
      "cuenta_Telefono": ["", [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      "usuario_FechaNacimiento": ["", Validators.required],
      "cuenta_Rol":["", Validators.required]
    });
  }

  async registrar() {
    if (this.registroForm.valid) {
      const loading = await this.loadingController.create({
        spinner: 'crescent',
        cssClass: 'custom-loading' 
      });
      await loading.present();
  
       this.datosUsuario = {
        ...this.registroForm.value,
        cuenta_Estado: "PENDIENTE",
        usuario_FechaNacimiento: this.formattedDate
      };
     this.registroService.registrarUsuario(this.datosUsuario).subscribe(
        async response => {
          await loading.dismiss();
          this.presentAlert(
            'Registro exitoso',
            'La cuenta ha sido guardada correctamente.',
            'OK',
            () => {
              this.router.navigate(['/perfil']);
            }
          );
          console.log('Registro exitoso', response);
        },
        async error => {
          console.error('Error en el registro', error);
          await loading.dismiss();
          this.presentAlert(
            'Error',
            'La cuenta no se guardó correctamente.',
            'OK',
            () => {
            }
          );
        }

      );
   }
  }

  toggleDateTime() {
    this.showDateTime = !this.showDateTime;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.formattedDate = this.formatDate(this.selectedDate);
    this.registroForm.get('usuario_FechaNacimiento')?.setValue(this.formattedDate);
    this.toggleDateTime();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
