import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'menu/home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'washing-machine', loadChildren: './washing-machine/washing-machine.module#WashingMachinePageModule' },
  { path: 'washing-machine-editor', loadChildren: './washing-machine-editor/washing-machine-editor.module#WashingMachineEditorPageModule' },
  { path: 'login-page', loadChildren: './login-page/login-page.module#LoginPagePageModule' },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },  { path: 'washing-machine-statut', loadChildren: './washing-machine-statut/washing-machine-statut.module#WashingMachineStatutPageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
