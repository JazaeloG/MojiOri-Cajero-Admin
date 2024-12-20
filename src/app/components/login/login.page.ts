import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  cuenta: any;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      cuenta_Telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      cuenta_Contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger', 
      position: 'top', 
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      if (this.loginForm.get('cuenta_Telefono')?.errors?.['required']) {
        await this.presentToast('El teléfono es requerido.');
      } else if (this.loginForm.get('cuenta_Telefono')?.errors?.['pattern']) {
        await this.presentToast('El teléfono debe tener 10 dígitos.');
      }
      if (this.loginForm.get('cuenta_Contrasena')?.errors?.['required']) {
        await this.presentToast('La contraseña es requerida.');
      } else if (this.loginForm.get('cuenta_Contrasena')?.errors?.['minlength']) {
        await this.presentToast('La contraseña debe tener al menos 6 caracteres.');
      }
      return;
    }

    const { cuenta_Telefono, cuenta_Contrasena } = this.loginForm.value;

    this.loginService.login(cuenta_Telefono, cuenta_Contrasena).subscribe(async response => {
      if (response.success) {
        this.loginService.getProfile().subscribe(async profile => {
          if (profile) {
            this.router.navigate(['/cajero/ventas']);
          } else {
            await this.presentToast('No se pudo verificar el perfil. Inténtalo de nuevo.');
          }
        });
      } else {
        await this.presentToast(response.error || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    }, async error => {
      console.error('Error en el proceso de login', error);
      await this.presentToast('Error en el servidor. Intenta nuevamente más tarde.');
    });
  }
}