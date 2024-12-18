import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuPage } from './menu.page';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'productos',
        loadChildren: () =>
          import('../productos/productos.module').then(
            (m) => m.ProductosPageModule
          ),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
      {
        path: 'editar-producto/:id',
        loadChildren: () =>
          import('../editar-producto/editar-producto.module').then(
            (m) => m.EditarProductoPageModule
          ),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
      {
        path: 'agregar-producto',
        loadChildren: () =>
          import('../agregar-producto/agregar-producto.module').then(
            (m) => m.AgregarProductoPageModule
          ),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('../configuracion/configuracion-routing.module').then(
            (m) => m.ConfiguracionPageRoutingModule
          ),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../perfil/perfil.module').then((m) => m.PerfilPageModule),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
      {
        path: 'graficas',
        loadChildren: () =>
          import('../graficas/graficas.module').then(
            (m) => m.GraficasPageModule
          ),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
      {
        path: 'registro',
        loadChildren: () =>
          import('../registro/registro.module').then(
            (m) => m.RegistroPageModule
          ),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
      {
        path: 'agregar-promocion',
        loadChildren: () =>
          import('../agregar-promocion/agregar-promocion.module').then(
            (m) => m.AgregarPromocionPageModule
          ),
        canActivate: [AuthGuard],
        data: { requiredRole: 'ADMINISTRADOR' }, 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
