import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OverviewComponent } from './overview/overview.component';
import { BesttimeComponent } from './besttime/besttime.component';
import { TrdspeedComponent } from './trdspeed/trdspeed.component';
import { BasicfeaComponent } from './basicfea/basicfea.component';
const routes = [
    { path: 'home', component: HomeComponent },
    { path: 'basic-features', component: BasicfeaComponent },
    { path: 'cate-temperature', component: OverviewComponent },
    { path: 'best-time', component: BesttimeComponent },
    { path: 'trd-speed', component: TrdspeedComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map