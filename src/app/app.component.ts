import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'yati-trend';
  sideNav = {
    opened: false
  };

  sideNavEvent(state : boolean){
     this.sideNav.opened = state;
  }


}
