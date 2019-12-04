import { __decorate } from "tslib";
import { Component } from '@angular/core';
let TrdspeedComponent = class TrdspeedComponent {
    constructor() { }
    ngOnInit() {
        var divElement = document.getElementById('viz1575412802619');
        var vizElement = divElement.getElementsByTagName('object')[0];
        vizElement.style.width = '100%';
        vizElement.style.height = '500px';
        var scriptElement = document.createElement('script');
        scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
        document.querySelector("#toolbar-container").setAttribute("style", "display:hidden");
    }
};
TrdspeedComponent = __decorate([
    Component({
        selector: 'app-trdspeed',
        templateUrl: './trdspeed.component.html',
        styleUrls: ['./trdspeed.component.css']
    })
], TrdspeedComponent);
export { TrdspeedComponent };
//# sourceMappingURL=trdspeed.component.js.map