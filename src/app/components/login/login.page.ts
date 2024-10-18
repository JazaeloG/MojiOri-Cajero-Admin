import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
    private router: Router
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

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const { cuenta_Telefono, cuenta_Contrasena } = this.loginForm.value;

    this.loginService.login(cuenta_Telefono, cuenta_Contrasena).subscribe(response => {
      if (response.success) {
        this.loginService.getProfile().subscribe(profile => {
          if (profile) {
            if (profile.cuenta_Rol === 'CAJERO') {
              this.router.navigate(['/ventas']);
            } else if (profile.cuenta_Rol === 'ADMINISTRADOR') {
              this.router.navigate(['/ventas']);
            } else if (profile.cuenta_Rol === 'USUARIO') {
              this.errorMessage = 'No tienes permisos para acceder a este portal.';
              this.loginService.logout();
            }
          } else {
            this.errorMessage = 'No se pudo verificar el perfil. Inténtalo de nuevo.';
          }
        });
      } else {
        this.errorMessage = response.error || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    }, error => {
      console.error('Error en el proceso de login', error);
      this.errorMessage = 'Error en el servidor. Intenta nuevamente más tarde.';
    });
  }
}