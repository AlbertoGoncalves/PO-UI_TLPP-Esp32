import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'index.html', pathMatch: 'full' },
  { path: 'index.html', component: HomeComponent },
  { path: 'trackers', loadChildren: () => import('./features/trackers/trackers.module').then(m => m.TrackersModule) },
  { path: 'packages', loadChildren: () => import('./features/package/packages.module').then(m => m.PackagesModule) },
  { path: 'shipments', loadChildren: () => import('./features/shipments/shipments.module').then(m => m.ShipmentsModule) },
  { path: 'expedition', loadChildren: () => import('./features/expedition/expedition.module').then(m => m.ExpeditionModule) }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
