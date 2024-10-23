import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/ventas',
        pathMatch: 'full'
      },
      {
        path: 'ventas',
        loadChildren: () => import('../ventas/ventas.module').then(m => m.VentasPageModule),
        canActivate: [authGuard]
      },
      {
        path: 'canjear-codigo',
        loadChildren: () => import('../canjear-codigo/canjear-codigo.module').then(m => m.CanjearCodigoPageModule),
        canActivate: [authGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
