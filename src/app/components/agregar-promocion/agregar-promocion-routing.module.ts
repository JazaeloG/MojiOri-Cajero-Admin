import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarPromocionPage } from './agregar-promocion.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPromocionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarPromocionPageRoutingModule {}
