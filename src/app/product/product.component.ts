import { Component, OnInit } from '@angular/core';
import {ApiManagerService, API_MODE, API_METHOD} from '../api-manager.service';
import {ShopSpineService, APP_EVENT_TYPES, AppEvent} from '../shop-spine.service'
import {ActivatedRoute} from '@angular/router'
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  config = null;

  product = {
    pathId: null,
    item: null
  }
  constructor(private shopService : ShopSpineService, 
              private apiService : ApiManagerService,
              private routeInfo: ActivatedRoute) { 
        
      this.routeInfo.paramMap.subscribe(param =>{
        // get the route information
        this.product.pathId = param.get('product');

        // get the website config
        this.shopService.getConfig().subscribe(evt =>{
          this.config = evt;
          this.getProduct();
       });

       this.shopService.childEventListener().subscribe(() => {
          this.shopService.getConfig().subscribe(evt =>{
            this.config = evt;
        });
       })
      })

    }

  ngOnInit(): void {
  }

  // Uses Api manager to get product
  getProduct(){
    let httpParams = new HttpParams()
    .set('itemId', this.product.pathId)
    .set('storeId', this.config.storeId);

    let resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'product', httpParams);
    resp.subscribe((evt : any) =>{
      this.product.item = evt.data;
    })
  }

  // function called by view for a change in currency
  onCurrencyChange(newCurrency : string) : void{
    this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.currencyChange, newCurrency));
  }

}
