import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuPage } from './menu.page';
const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('../ventas/ventas.module').then((m) => m.VentasPageModule),
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('../productos/productos.module').then(
            (m) => m.ProductosPageModule
          ),
      },
      {
        path: 'editar-producto/:id',
        loadChildren: () =>
          import('../editar-producto/editar-producto.module').then(
            (m) => m.EditarProductoPageModule
          ),
      },
      {
        path: 'agregar-producto',
        loadChildren: () =>
          import('../agregar-producto/agregar-producto.module').then(
            (m) => m.AgregarProductoPageModule
          ),
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('../configuracion/configuracion-routing.module').then(
            (m) => m.ConfiguracionPageRoutingModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      
  {
    path: 'graficas',
    loadChildren: () => import('../graficas/graficas.module').then( m => m.GraficasPageModule)
  },
      {
        path: 'registro',
        loadChildren: () => import('../registro/registro.module').then( m => m.RegistroPageModule)
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      
  {
    path: 'agregar-promocion',
    loadChildren: () => import('../agregar-promocion/agregar-promocion.module').then( m => m.AgregarPromocionPageModule)
  }
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
