import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WashingMachineEditorPage } from './washing-machine-editor.page';

const routes: Routes = [
  {
    path: '',
    component: WashingMachineEditorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WashingMachineEditorPage]
})
export class WashingMachineEditorPageModule {}
