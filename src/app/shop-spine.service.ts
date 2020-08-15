import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import {BehaviorSubject, Observable, interval} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TokenStorageService} from './token-storage.service';

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
  private loadingConfig = false;

  constructor(private http : HttpClient, 
              private storageService: TokenStorageService,
              @Inject(LOCALE_ID) public locale: string) { 
     let version = storageService.getString('version');
     if(version == null){
       this.configVersion = 0;
     }
     else
       this.configVersion = parseInt(version);

    this.customerDetails = this.storageService.getObj('shopping');
  }

  // function called by children to register event
  emitEvent(msg: AppEvent){

    this.getConfig().subscribe(() => {
      switch(msg.eventType){

        case APP_EVENT_TYPES.currencyChange:
          this.shopConfig.preferences.currency.chosen = msg.eventValue;
          this.storageService.setObj('preferences', this.shopConfig.preferences);
          break;
  
        case APP_EVENT_TYPES.countryCode:
          this.shopConfig.preferences.countryCode = msg.eventValue;
  
          // need to update this info in the customer details too as required by web api
          this.customerDetails.countryCode = msg.eventValue;
          this.storageService.setObj('preferences', this.shopConfig.preferences);
          this.storageService.setObj('shopping', this.customerDetails);
          break;
  
        case APP_EVENT_TYPES.deliveryMethod:
            this.shopConfig.preferences.deliveryMethod = msg.eventValue;
            this.storageService.setObj('preferences', this.shopConfig.preferences);
          break;     
      }
      
      // publish events to child events
      this.childEvents.next(msg)

    })
    
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
      this.storageService.setObj('shopping', details);
    }

  // returns the current config and preferences
  getConfig(){
    return new Observable(subscriber =>{
        // check to see if we are already loading the config from a previous request
        if(this.loadingConfig){
           let counter = 0;

           // set interval to check for a loaded config every 50ms
           let interval = setInterval(()=>{
              if(this.shopConfig != null){
                subscriber.next(this.shopConfig);

                // clear interval once we get the config
                clearInterval(interval);
              }else{
                 counter++;

                 // give up on waiting for interval
                 if(counter >= 10){
                  clearInterval(interval);
                  return null;
                 }
              }
           }, 50);
        }
        if(this.shopConfig != null){
          subscriber.next(this.shopConfig);
        } else{
           // get configuration file (which is a json)
            this.loadingConfig = true;
            this.http.get('assets/config.json').subscribe((resp : any)=>{
              let config = resp;
              if(config.version == this.configVersion){
                let prefs = this.storageService.getObj('preferences');

                // if for what ever reason the preferences don't exist
                if(prefs == null){
                  this.shopConfig = { preferences : config.preferences};
                  this.storageService.setObj('preferences', this.shopConfig.preferences);
                }else
                 this.shopConfig = {preferences : prefs};

              } else{ // version numbers are different
                  this.shopConfig = {preferences: config.preferences};
                  this.storageService.setObj('preferences', this.shopConfig.preferences);
                  this.storageService.setString('version', config.version.toString());
                  this.customerDetails = config.shopping.contact;
                  this.storageService.setObj('shopping', config.shopping.contact);
                  this.configVersion = config.version;
              }
              this.shopConfig['imgSrc'] = config.imgSrc;
              this.shopConfig['storeId'] = config.storeId;
              this.shopConfig.preferences.lang = this.getLang(this.locale);
              this.loadingConfig = false;
              subscriber.next(this.shopConfig);
          });
        }
    })
  }

  // gets the language of website based on given locale
  private getLang(locale : string){
      if(locale.indexOf('hu') >= 0){
         return 'hu'
      }else if(locale.indexOf('en') >= 0){
        return 'en'
     }
     return 'hu'
  }
}
