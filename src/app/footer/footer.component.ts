import { Component, OnInit } from '@angular/core';
import {ShopSpineService} from '../shop-spine.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  config = null;
  constructor(private shopService: ShopSpineService) {
    setTimeout(()=>{
        shopService.getConfig().subscribe(res =>{
          this.config = res;
        })
    }, 500);
  }

  ngOnInit(): void {
  }

}
