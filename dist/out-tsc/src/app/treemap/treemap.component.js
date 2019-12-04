import { __decorate } from "tslib";
import { Component } from '@angular/core';
let TreemapComponent = class TreemapComponent {
    constructor() { }
    ngOnInit() {
        ["view", "like", "dislike", "comment"].forEach(i => this.draw(i));
    }
    draw(id) {
        var divElement = document.querySelector("#" + id);
        var vizElement = divElement.getElementsByTagName('object')[0];
        vizElement.style.width = '100%';
        vizElement.style.height = '400px';
        var scriptElement = document.createElement('script');
        scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
        var too = document.querySelector("#toolbar-container");
        if (too)
            too.setAttribute("style", "display:hidden");
    }
};
TreemapComponent = __decorate([
    Component({
        selector: 'app-treemap',
        templateUrl: './treemap.component.html',
        styleUrls: ['./treemap.component.css']
    })
], TreemapComponent);
export { TreemapComponent };
//# sourceMappingURL=treemap.component.js.map