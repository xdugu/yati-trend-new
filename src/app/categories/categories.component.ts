import { Component, OnInit } from '@angular/core';
import {ApiManagerService, API_MODE, API_METHOD} from '../api-manager.service';
import {ShopSpineService, APP_EVENT_TYPES, AppEvent} from '../shop-spine.service'
import {HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router'
import {Common} from '../common'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css', '../app.component.css']
})
export class CategoriesComponent implements OnInit {
  constructor(private routeInfo: ActivatedRoute, private apiService: ApiManagerService, 
              private shopService: ShopSpineService) { }

  // contains the current config
  config = null;
  commonFunc = Common;
  
  // store received catagory data in the 'items' property
  category = {
    category: null,
    items: null,
    title: null
  }
  categoryConfig = {
        dots: false,
				infinite: true,
				slidesToShow: 2,
				slidesToScroll: 1,
				autoplay: false,
        lazyLoad: 'ondemand',
        arrows: false,
				responsive: [
				{
					breakpoint: 600, // mobile breakpoint
					settings: {
						slidesToShow: 1
					}
				}
				]	
	};
  
  ngOnInit(): void {
    let params = this.routeInfo.paramMap;

    // will get a callback anytime there is a change in the category path
    params.subscribe(param => {
      this.category.category = param.get('category');
      if(this.config != null)
        this.getCategoryData();
    });

       // assign currency
       this.shopService.getConfig().subscribe(evt =>{
        this.config = evt;
        this.getCategoryData();
      });

       // add listener to change values
        this.shopService.childEventListener().subscribe(() =>{         
          // request new config as there was probably a change in the config
          this.shopService.getConfig().subscribe(evt =>{
            this.config = evt;
          });
        })
    
  }

  // function called by view for a change in currency
  onCurrencyChange(newCurrency : string) : void{
    this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.currencyChange, newCurrency));
  }

  //This function will call the api service to get the items in the category
  private getCategoryData(){

    // set header params
    let httpParams = new HttpParams()
              .set('category', this.category.category)
              .set('storeId', this.config.storeId + '>Product');
    
    // get data
    let resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'category', httpParams);
    resp.subscribe(evt =>{
      this.category.items = evt;
      
      let level = this.category.items[0].Category.split('>');

      // looping through the product hierarchy to get the displayable name of the category
      let category = this.category.items[0].ProductHierarchy.find(item => item.name == level[0]);
      for(let i = 1; i < level.length; i++){
        category = category.sub.find(item => item.name == level[i]);
      }
      
      this.category.title = category.text;
    })

  }



}
