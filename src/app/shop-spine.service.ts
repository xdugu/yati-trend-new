import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { HttpClient} from '@angular/common/http';

export enum APP_EVENT_TYPES{
  none,
  currencyChange,
}

// holder class to hold event 
export class AppEvent{
  constructor(public eventType: APP_EVENT_TYPES, public eventValue: string){
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

  constructor(private http : HttpClient) { 
  }

  // function called by children to register event
  emitEvent(msg: AppEvent){
    this.shopConfig.shopping.currency.chosen = msg.eventValue;
    this.childEvents.next(msg)
  }

  // function called to subscribe to events
  childEventListener(){
    return this.childEvents.asObservable();
  } 

  getConfig(){
    return new Observable(subscriber =>{
        if(this.shopConfig != null){
          subscriber.next(this.shopConfig);
        } else{
           // get configuration file (which is a json)
            this.http.get('assets/config.json').subscribe(resp =>{
              this.shopConfig = resp;
              subscriber.next(this.shopConfig);
          });
        }
    })
  }
}
