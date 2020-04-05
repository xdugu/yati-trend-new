import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ShopSpineService, APP_EVENT_TYPES, AppEvent} from '../shop-spine.service'

@Component({
  selector: 'app-currency-chooser',
  templateUrl: './currency-chooser.component.html',
  styleUrls: ['./currency-chooser.component.css']
})
export class CurrencyChooserComponent implements OnInit {
  public currency;

  constructor(private shopService: ShopSpineService) { }

  ngOnInit(): void {
    // assign currency
     this.currency = this.shopService.getConfig().currency;

    // add listener to change values
     this.shopService.childEventListener().subscribe(evt =>{

      // check that we are listening to correct event
       if(evt.eventType == APP_EVENT_TYPES.currencyChange){
        this.currency.chosen = evt.eventValue;
       }
     })
  }

  // function called by view for a change in currency
  changeCurrency(currency : string) : void{
    this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.currencyChange, currency));
  }

}
