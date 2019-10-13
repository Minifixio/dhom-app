import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WashingMachineStatutPage } from './washing-machine-statut.page';

import { NgxD3LiquidFillGaugeComponent } from '../../components/ngx-d3-liquid-fill-gauge/ngx-d3-liquid-fill-gauge.component';
import { LiquidGaugeComponent } from '../../components/liquid-gauge/liquid-gauge';

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
    RouterModule.forChild(routes)
  ],
  declarations: [WashingMachineStatutPage, NgxD3LiquidFillGaugeComponent, LiquidGaugeComponent]
})
export class WashingMachineStatutPageModule {}
