import { Component, OnInit } from '@angular/core';
import {ShopSpineService} from '../shop-spine.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private shopService : ShopSpineService) { }

  config = null;

  ngOnInit(): void {
      this.shopService.getConfig().subscribe(config =>{
        this.config = config;
      })
  }

}
