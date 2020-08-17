import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import {Router, NavigationEnd} from '@angular/router'
import {GoogleAnalyticsService} from 'ngx-google-analytics';
import {Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private currentEvent : Subscription;

  constructor(private storageService: TokenStorageService,
              private router: Router,
              private gaService: GoogleAnalyticsService) { 

  }

  //called to initialise tracking
  run(){
    // only run once to prevent leaks from multiple calls to run
      if(this.currentEvent == null){
        this.subscribeAndTrack();
      }
  }

  // function to stop subscription
  stopTracking(){
    let state = this.storageService.getString('useCookie');

     if(state != 'false'){
      this.currentEvent.unsubscribe();
      this.storageService.setString('useCookie', 'false');
     }
  }

  //function to continue subscription
  startTracking(){
    let state = this.storageService.getString('useCookie');

    if(state == 'false'){
      this.storageService.setString('useCookie', 'true');
      this.subscribeAndTrack();
    }
  }

  // returns the current tracking status
  getTrackingStatus(): boolean{
     let state = this.storageService.getString('useCookie');
     return state == 'true' || state == null;
  }

  // function to actually subscribe to router changes and publish ga events
  private subscribeAndTrack(){
    let cookieStatus = this.storageService.getString('useCookie');
        if(cookieStatus == 'true' || cookieStatus == null){
        this.currentEvent =  this.router.events
                                .subscribe(event => {
                                if (event instanceof NavigationEnd) {
                                  this.gaService.pageView(event.urlAfterRedirects, undefined);
                                }
                              });
        }

  }
}
