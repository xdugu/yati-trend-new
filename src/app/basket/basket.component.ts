import { Component, OnInit} from '@angular/core';
import {BasketService} from '../basket.service';
import {ShopSpineService, APP_EVENT_TYPES, AppEvent} from '../shop-spine.service';
import {Common} from '../common';
import {MatSelectChange} from '@angular/material/select';
import {MatRadioChange} from '@angular/material/radio';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css', '../app.component.css']
})
export class BasketComponent implements OnInit{

  basket = null;
  config = null;
  availableQuantities = ['1', '2', '3', '4', '5'];
  commonLib = Common;

  constructor(private shopService: ShopSpineService,
              private basketService: BasketService) { }


  ngOnInit(): void {
     this.shopService.getConfig().subscribe(config => {
        this.config = config;
     });

     // get basket (if exists)
     this.basketService.getBasket().subscribe(basket => {
         this.processBasket(basket);
     });

     this.shopService.childEventListener().subscribe((evt) => {

      // get any new basket data
        if (evt.eventType === APP_EVENT_TYPES.newBasketData){
           this.processBasket(evt.eventValue);
        }
        this.shopService.getConfig().subscribe(config => {
           this.config = config;
        });
     });
  }


  // change of quantity
   changeQuantity(event: any, item: any, index: number){
      const val = parseInt(event.value, 10);

     // call service to update basket
      this.basketService.changeQuantity(index, val).subscribe(basket => {
         this.processBasket(basket);
      });
  }
    // remove an item from basket
   removeItem(index: number){
      this.basketService.removeItem(index).subscribe(basket => {
      this.processBasket(basket);
    });
   }

   // processBasket - called to update delivery courier based on receiving a new basket
   private processBasket(basket: any){
       if (basket != null && basket.Items.length > 0 && this.config.preferences.countryCode != null &&
               this.config.preferences.countryCode.length === 2){
           this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.deliveryMethod, Object.keys(basket.Costs[this.config.preferences.countryCode])[0]));
       }
       this.basket = basket;
   }
    // function called by view for a change in currency
    onCurrencyChange(newCurrency: string): void{
      this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.currencyChange, newCurrency));
    }


    // to prevent a dom re-draw of the basket list, this function assigns a unique id
    // to each item in the basket based on a few unique properties of the basket item
    basketTrackFn(index: number, item: any){
       let finalCombi = '';
       if (item.hasOwnProperty('Combination')){
            item.Combination.forEach(combi => {
                finalCombi += combi.name;
                if (combi.enteredValue != null){
                  finalCombi += combi.enteredValue;
                }
            });
       }

       return item.ItemId + finalCombi;
    }

    // called when there is a change in the selected country
    onCountryChange(event: MatSelectChange){

            this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.countryCode, event.value));
            this.processBasket(this.basket);
    }

    // called when there is a change in the selected courier
    onCourierChange(event: MatRadioChange){
      this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.deliveryMethod, event.value));
   }





}
