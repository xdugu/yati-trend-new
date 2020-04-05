import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

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
  private shopConfig = {
    currency:{
       chosen: "HUF",
       available: ["HUF", "EUR"]
    }
  }

  constructor() { }

  // function called by children to register event
  emitEvent(msg: AppEvent){
    this.shopConfig.currency.chosen = msg.eventValue;
    this.childEvents.next(msg)
  }

  // function called to subscribe to events
  childEventListener(){
    return this.childEvents.asObservable();
  } 

  getConfig(){
    return this.shopConfig;
  }
}
