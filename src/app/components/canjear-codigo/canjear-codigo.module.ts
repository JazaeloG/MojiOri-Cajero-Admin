import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanjearCodigoPageRoutingModule } from './canjear-codigo-routing.module';

import { CanjearCodigoPage } from './canjear-codigo.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanjearCodigoPageRoutingModule,
    ZXingScannerModule
  ],
  declarations: [CanjearCodigoPage]
})
export class CanjearCodigoPageModule {}
