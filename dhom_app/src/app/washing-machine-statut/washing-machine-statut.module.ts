import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WashingMachineStatutPage } from './washing-machine-statut.page';

import { LiquidGaugeComponent } from '../../components/liquid-gauge/liquid-gauge';
import { NgxD3LiquidFillGaugeModule } from 'src/components/ngx-d3-liquid-fill-gauge/ngx-d3-liquid-fill-gauge.module';

const routes: Routes = [
  {
    path: '',
    component: WashingMachineStatutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxD3LiquidFillGaugeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WashingMachineStatutPage, LiquidGaugeComponent]
})
export class WashingMachineStatutPageModule {}
