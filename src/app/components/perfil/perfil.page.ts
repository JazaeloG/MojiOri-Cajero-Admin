import { Component, OnInit } from '@angular/core';
import { PerfilService } from 'src/app/services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  cajeros: any;
  administradores: any;
  constructor( private perfilService : PerfilService) { }

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
}
