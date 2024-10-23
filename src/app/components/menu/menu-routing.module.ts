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
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
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
