import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';

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

  constructor(private fb: FormBuilder, private registroService: RegistroService, private router: Router) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      "usuario_Usuario": ["", Validators.required],
      "cuenta_Contrasena": ["", [Validators.required, Validators.minLength(8)]],
      "cuenta_Telefono": ["", [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      "usuario_FechaNacimiento": ["", Validators.required],
    });
  }

  registrar() {
    if (this.registroForm.valid) {
       this.datosUsuario = {
        ...this.registroForm.value,
        cuenta_Estado: "PENDIENTE",
        cuenta_Rol: "CAJERO",
        usuario_FechaNacimiento: this.formattedDate
      };
     this.registroService.registrarUsuario(this.datosUsuario).subscribe(
        response => {
          this.router.navigate(['/verificar-numero', this.datosUsuario.cuenta_Telefono]);
        },
        error => console.error('Error en el registro', error)
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
}
