import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {BasketService} from '../basket.service';
import {ShopSpineService, APP_EVENT_TYPES} from'../shop-spine.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  screenState = 'mobile';
  basketNumber = 0;
  // creating event emitter to parent to tell what to do with the sidenav
  @Output() sideNavOpenEvent = new EventEmitter<boolean>();

  constructor(
    public breakpointObserver: BreakpointObserver,
    private shopService : ShopSpineService,
    private basketService: BasketService
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
    // get the initial number of items in basket
     this.basketService.getBasketCount().subscribe((num : number) =>{
        this.basketNumber = num;
     })
     // subscribe to event about a change in the number of items in basket
     this.shopService.childEventListener().subscribe(evt =>{
        if(evt.eventType == APP_EVENT_TYPES.basketNumber){
           this.basketNumber = evt.eventValue;
        }
     })
  }


  // function is called when menu is requested to be shown
  showMenu(){
    this.sideNavOpenEvent.emit(true);
  }

}
