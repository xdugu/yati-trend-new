import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  screenState = 'mobile'

  // creating event emitter to parent to tell what to do with the sidenav
  @Output() sideNavOpenEvent = new EventEmitter<boolean>();

  constructor(
    public breakpointObserver: BreakpointObserver
  ) {
    // checking for screen of mobile
      breakpointObserver.observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait,
      ]).subscribe(result => {
        if (result.matches) {
          this.screenState = 'mobile'
        }
      });

    // Check for tablets in protrait mode
      breakpointObserver.observe([
        Breakpoints.Tablet,
        Breakpoints.TabletPortrait
      ]).subscribe(result => {
        if (result.matches) {
          this.screenState = 'tablet'
        }
      });

    // check for tablets widescreen items
      breakpointObserver.observe([
        Breakpoints.WebLandscape,
        Breakpoints.WebPortrait,
        Breakpoints.TabletLandscape
      ]).subscribe(result => {
        if (result.matches) {
          this.screenState = 'wide_screen'
        }
      });
   }

  ngOnInit(): void {
  }

  // function is called when menu is requested to be shown
  showMenu(){
    this.sideNavOpenEvent.emit(true);
  }

}
