import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient} from '@angular/common/http';

export enum APP_EVENT_TYPES{
  none,
  currencyChange,
  basketNumber,
  countryCode,
  newBasketData,
  deliveryMethod,
}

// holder class to hold event 
export class AppEvent{
  constructor(public eventType: APP_EVENT_TYPES, public eventValue: any){
  }
}


@Injectable({
  providedIn: 'root'
})

/* This service will be the backbone where children components can communicate with
the master component */


export class ShopSpineService {
  private childEvents = new BehaviorSubject<AppEvent>(new AppEvent(APP_EVENT_TYPES.none, ''));
  private shopConfig = null;
  private configVersion = null;
  private customerDetails = null;

  constructor(private http : HttpClient) { 
     let version = localStorage.getItem('version');
     if(version == null){
       this.configVersion = 0;
     }
     else
       this.configVersion = parseInt(version);

    let cust = localStorage.getItem('shopping');
    if( cust != null){
       this.customerDetails = JSON.parse(cust);
    }
  }

  // function called by children to register event
  emitEvent(msg: AppEvent){
    switch(msg.eventType){

      case APP_EVENT_TYPES.currencyChange:
        this.shopConfig.preferences.currency.chosen = msg.eventValue;
        localStorage.setItem('preferences', JSON.stringify(this.shopConfig.preferences));
        break;

      case APP_EVENT_TYPES.countryCode:
        this.shopConfig.preferences.countryCode = msg.eventValue;
        localStorage.setItem('preferences', JSON.stringify(this.shopConfig.preferences));
        break;

      case APP_EVENT_TYPES.deliveryMethod:
          this.shopConfig.preferences.deliveryMethod = msg.eventValue;
          localStorage.setItem('preferences', JSON.stringify(this.shopConfig.preferences));
        break;
      

      
    }
    
    this.childEvents.next(msg)
  }

  // function called to subscribe to events
  childEventListener(){
    return this.childEvents.asObservable();
  }

  //
   //returns the customer details e.g. addresses,country codes, etc
   getCustomerDetails(){
      // if we have no shopping, data create one using the template from the config file
      return new Observable(sub =>{
        if(this.customerDetails == null){
          this.getConfig().subscribe(() =>{
          sub.next(this.customerDetails);
        })
      }
      else
          sub.next(this.customerDetails);
      })     
    }

    //sets the customer details
    setCustomerDetails(details : any){
      this.customerDetails = details;
      localStorage.setItem('shopping', JSON.stringify(details));
    }



  // returns th current config and preferences
  getConfig(){
    return new Observable(subscriber =>{
        if(this.shopConfig != null){
          subscriber.next(this.shopConfig);
        } else{
           // get configuration file (which is a json)
            this.http.get('assets/config.json').subscribe((resp : any)=>{
              let config = resp;
              if(config.version == this.configVersion){
                let prefs = localStorage.getItem('preferences');

                // if for what ever reason the preferences don't exist
                if(prefs == null){
                  this.shopConfig = { preferences : config.preferences};
                  localStorage.setItem('preferences', JSON.stringify(this.shopConfig.preferences));
                }else
                 this.shopConfig = {preferences : JSON.parse(prefs)};

              } else{ // version numbers are different
                  this.shopConfig = {preferences: config.preferences};
                  localStorage.setItem('preferences', JSON.stringify(this.shopConfig.preferences));
                  localStorage.setItem('version', config.version.toString());
                  this.customerDetails = config.shopping;
                  localStorage.setItem('shopping', JSON.stringify(config.shopping));
                  this.configVersion = config.version;
              }
              this.shopConfig['imgSrc'] = config.imgSrc;
              this.shopConfig['storeId'] = config.storeId;
              subscriber.next(this.shopConfig);
          });
        }
    })
  }
}
