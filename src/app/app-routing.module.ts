import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OverviewComponent } from './overview/overview.component';
import { BesttimeComponent } from './besttime/besttime.component';
import { TrdspeedComponent } from './trdspeed/trdspeed.component';
import { BasicfeaComponent } from './basicfea/basicfea.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'basic-features', component: BasicfeaComponent},
  {path: 'cate-temperature', component: OverviewComponent},
  {path: 'best-time', component: BesttimeComponent},
  {path: 'trd-speed', component: TrdspeedComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
