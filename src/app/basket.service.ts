import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpParams} from '@angular/common/http';
import {ApiManagerService, API_METHOD, API_MODE} from './api-manager.service'
import {ShopSpineService, AppEvent, APP_EVENT_TYPES} from './shop-spine.service'
import {TokenStorageService} from './token-storage.service'

@Injectable({
  providedIn: 'root'
})

// Basket service class handles all interactions between application and server with
// regards to the shopping basket
export class BasketService {


  private basket = null;  // stores information on the basket
  private basketId = null; // stored info on the basket id
  private config = null; // stores general config info - gets the store id from this data

  constructor(private apiService : ApiManagerService, 
              private shopService : ShopSpineService,
              private storageService: TokenStorageService) { 
     this.basketId = this.storageService.getString('basketId');
  }

  // gets the number of items in a basket
  getBasketCount (){
    return new Observable(subscriber =>{
      this.getBasket().subscribe((evt : any) => {
        if(evt == null){
          subscriber.next(0);
        }
        else
          subscriber.next(evt.Count);
     })

    }); 

  }

  // returns the current basket
  getBasket(noCache = false){
    return new Observable(subscriber =>{
      this.getConfig().subscribe((config : any) => {
          if(this.basket == null && this.basketId == null){
            subscriber.next(null);
          }else if(this.basket == null || noCache){
              this.apiService.post(API_MODE.OPEN, API_METHOD.GET, 'basket', new HttpParams(), {
                basketId: this.basketId,
                storeId: config.storeId,
              }).subscribe(evt =>{
                  this.basket = evt;
                  subscriber.next(this.basket);
              });
          // get current basket items

          }else{
            subscriber.next(this.basket);
          }
      })
      
   })

  }

  // called when an item is required to be added to the basket
  addToBasket(itemId : string, combination : any){
    return new Observable(sub =>{
      this.getConfig().subscribe((config : any) =>{
        this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket', new HttpParams(), {
             itemId: itemId,
             basketId: this.basketId,
             storeId: config.storeId,
             combination: combination
          }).subscribe((evt : any) => {
             this.basketId = evt.BasketId;
             this.storageService.setString('basketId', this.basketId);
             this.basket = evt;
             // emit event to let all subscribers know that the number of item in basket 
             // may have changed
             this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.basketNumber, this.basket.Count));
             sub.next(evt);
          })
        })
    })
     
  }

  // changes the quantity of an item in basket
  changeQuantity(index : number, increment : number){
    return new Observable (sub => {
        this.getConfig().subscribe((config : any) => {
          this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket/quantity', new HttpParams(), {
            basketId: this.basketId,
            storeId: config.storeId,
            index : index,
            increment: increment,
         }).subscribe(basket =>{
            this.basket = basket;
            this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.basketNumber, this.basket.Count));
            sub.next(this.basket);
         })
        })
    })
  }

    // removes an item from the basket
    removeItem(index : number){
      return new Observable (sub => {
          this.getConfig().subscribe((config : any) => {
            this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket/remove', new HttpParams(), {
              basketId: this.basketId,
              storeId: config.storeId,
              index : index,
           }).subscribe(basket =>{
              this.basket = basket;
              this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.basketNumber, this.basket.Count));
              sub.next(this.basket);
           })
          })
      })
    }
  
  // final step to be called to process customer order
  order(paymentType : string, comments: string, details : any){
    return new Observable(sub => {
        this.shopService.getCustomerDetails().subscribe((cust : any) => {
          this.getConfig().subscribe((config: any) =>{
            this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket/order', new HttpParams(), {
              orderDetails: {
                 "contact": cust,
                 "currency": config.preferences.currency.chosen,
                 "paymentMethod": paymentType == 'payOnDelivery' ? 'payOnDelivery' : 'payBeforeDelivery',
                 "paymentType": paymentType, 
                 "deliveryMethod": config.preferences.deliveryMethod,
                 "comments": comments,
                 "paymentDetails": details
              },
              basketId: this.basketId,
              storeId:  config.storeId
            }).subscribe(()=>{
             // delete all reference to the basket
              this.storageService.removeItem('basketId');
 
             // return true that success in order
              this.basket = [];
              this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.basketNumber, 0));
              sub.next(true);  
            },
            err => {
                console.log(err);
                sub.next(false);
            })
          }); 
        }); 
    });
  }

  // returns the current website config
  getConfig(){
    return new Observable(sub=>{

      //check if we have already saved the config
      if(this.config != null && this.config != undefined){
         sub.next( this.config);
      }else{
           //get shopping config to get store id
           this.shopService.getConfig().subscribe(evt =>{
           this.config = evt;
           sub.next(this.config);
        });
      }
    });
  }

}
