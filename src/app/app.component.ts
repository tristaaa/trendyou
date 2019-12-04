import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'Strategies Behind Youtube Trending Vidoes';
  public isActive = false;

  @HostListener("window:scroll",['$event']) changeNav($event){
    var currTop = $event.srcElement.scrollingElement.scrollTop
    if (currTop >30) {
      this.isActive = true;
    }else{
      this.isActive = false;
    }
  }
}
