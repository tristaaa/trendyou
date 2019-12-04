import { __decorate } from "tslib";
import { Component, HostListener } from '@angular/core';
let AppComponent = class AppComponent {
    constructor() {
        this.title = 'Strategies Behind Youtube Trending Vidoes';
        this.isActive = false;
    }
    changeNav($event) {
        var currTop = $event.srcElement.scrollingElement.scrollTop;
        if (currTop > 30) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
    }
};
__decorate([
    HostListener("window:scroll", ['$event'])
], AppComponent.prototype, "changeNav", null);
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map