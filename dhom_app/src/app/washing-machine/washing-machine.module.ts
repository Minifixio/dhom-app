import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WashingMachinePage } from './washing-machine.page';

const routes: Routes = [
  {
    path: '',
    component: WashingMachinePage,
    children: [
      {
        path: 'tab1',
        loadChildren: '../washing-machine-statut/washing-machine-statut.module#WashingMachineStatutPageModule'
      },
      {
        path: 'tab2',
        loadChildren: '../washing-machine-editor/washing-machine-editor.module#WashingMachineEditorPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WashingMachinePage]
})
export class WashingMachinePageModule {}
