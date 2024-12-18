import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'prefix'
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard]
  },

  {
    path: '',
    loadChildren: () => import('./components/menu/menu.module').then(m => m.TabsPageModule), canActivate: [AuthGuard]
    },
  {
    path: 'configuracion',
    loadChildren: () => import('./components/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
