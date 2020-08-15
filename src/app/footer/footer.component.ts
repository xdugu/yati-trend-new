import { Component, OnInit } from '@angular/core';
import {ShopSpineService} from '../shop-spine.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

//Component class to host footers
export class FooterComponent{

  config = null;
  constructor(private shopService: ShopSpineService) {

    this.shopService.getConfig().subscribe(res =>{
      this.config = res;
    });
  }


}
