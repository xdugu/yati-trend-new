import { Component, OnInit } from '@angular/core';
import {ShopSpineService} from '../shop-spine.service';
import {TrackingService} from '../tracking.service'
import {MatCheckboxChange} from '@angular/material/checkbox';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

// class to handle settings (now cookie tracking)
export class SettingsComponent implements OnInit {
  config = null;
  trackingState = false;

  constructor(private shopService: ShopSpineService,
              private tracking: TrackingService) { }

  ngOnInit(): void {
      this.shopService.getConfig().subscribe(res =>{
          this.config = res;
      })
      this.trackingState = this.tracking.getTrackingStatus();
  }

  // called whenthe user changes the state of the tracking
  onTrackingChange(event: MatCheckboxChange):void{
    if(event.checked)
      this.tracking.startTracking();
    else
      this.tracking.stopTracking();
  }

}
