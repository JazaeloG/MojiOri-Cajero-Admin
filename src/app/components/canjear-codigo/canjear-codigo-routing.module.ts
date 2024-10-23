import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanjearCodigoPage } from './canjear-codigo.page';

const routes: Routes = [
  {
    path: '',
    component: CanjearCodigoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanjearCodigoPageRoutingModule {}
