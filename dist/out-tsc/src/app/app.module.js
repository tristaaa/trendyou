import { __decorate } from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';
import { HomeComponent } from './home/home.component';
import { BarchartComponent } from './barchart/barchart.component';
import { BesttimeComponent } from './besttime/besttime.component';
import { LolliComponent } from './lolli/lolli.component';
import { MapdonutComponent } from './mapdonut/mapdonut.component';
import { TrdspeedComponent } from './trdspeed/trdspeed.component';
import { LinechartComponent } from './linechart/linechart.component';
import { BasicfeaComponent } from './basicfea/basicfea.component';
import { TreemapComponent } from './treemap/treemap.component';
import { BubbleComponent } from './bubble/bubble.component';
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            OverviewComponent,
            HomeComponent,
            BarchartComponent,
            BesttimeComponent,
            LolliComponent,
            MapdonutComponent,
            TrdspeedComponent,
            LinechartComponent,
            BasicfeaComponent,
            TreemapComponent,
            BubbleComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map