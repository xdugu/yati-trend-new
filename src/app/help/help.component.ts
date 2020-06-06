import { Component, OnInit } from '@angular/core';
import {ShopSpineService} from '../shop-spine.service'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor(private shopService : ShopSpineService) { }

  config = null;

  // variable to store the currently expanded accordion
  currentExpanded = null;

  ngOnInit(): void {

    this.shopService.getConfig().subscribe(config =>{
      this.config = config;
    })
  }



}
