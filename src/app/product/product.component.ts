import { Component, OnInit } from '@angular/core';
import {ApiManagerService, API_MODE, API_METHOD} from '../api-manager.service';
import {ShopSpineService, APP_EVENT_TYPES, AppEvent} from '../shop-spine.service';
import {BasketService} from '../basket.service';
import {ActivatedRoute} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Common} from '../common'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css', '../app.component.css']
})
export class ProductComponent implements OnInit {

  // will store the general store config
  config = null;
  customerDetails = null;

  // stores the currently expanded accordion. Mainly uses to laxzy load info in accordian
  currentlyExpanded = null;

  slickConfig = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
    {
      breakpoint: 600, // mobile breakpoint
      settings: {
        slidesToShow: 1
      }
    }
    ]	
};

  //will store product information
  product = {
    pathId: null, //at the moment, the id of the product
    item: null // will contain the data directly from the server
  }
  pickedSpec = [];
  commonFunc = Common;

  constructor(private shopService : ShopSpineService, 
              private apiService : ApiManagerService,
              private routeInfo: ActivatedRoute,
              private basketService : BasketService,
              private snackBar : MatSnackBar) { 
      
      // get params of current route
      this.routeInfo.paramMap.subscribe(param =>{
        // get the route information
        this.product.pathId = param.get('product');

        // get the website config
        this.shopService.getConfig().subscribe(evt =>{
          this.config = evt;
          this.getProduct();
       });

       // listen to changes that might affect data
       // at the moment, listens to the all events, will restrict when needed
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
      this.setupVariants();
    })
  }

  //adds item to basket
  addToBasket(){
     this.basketService.addToBasket(this.product.item.ItemId, this.pickedSpec).subscribe(
       ()=> {
          let msg = {en: "Item added successfully", hu:"A termék a kosaradba került"}
          this.snackBar.open(msg[this.config.preferences.lang], '',{
              duration: 2000
          });
       }
     )
  }

  // setup variant
  setupVariants(){

    let product = this.product.item;

     if(this.product.item.Variants.variants.length > 0){
        //pre-choose the first combination in list
        function findFirstValid(candidate){
          if(product.TrackStock)
            return !candidate.disabled && candidate.quantity > 0
          else
            return !candidate.disabled;
        }

        let combi = this.product.item.Variants.combinations.find(findFirstValid);

			// in case none are valid, choose the first option
			if(combi == undefined)
				combi = this.product.item.Variants.combinations[0];

			// now loop through each variant to pick right combi
			this.product.item.Variants.variants.forEach((variant : any, index : number) =>{
				variant.options.forEach((option : any) => {
					 if(combi.combination[index] == option.name){
						this.pickedSpec.push(option);
						if(variant.type == "group"){
							let groupKeys = Object.keys(variant.groupInfo);
							this.pickedSpec[this.pickedSpec.length - 1].chosenVariant = 
									variant.groupInfo[groupKeys[0]][0];
						}
					 }
				});
			});

			this.product.item.Price = Object.assign(this.product.item.Price, combi.price);
			this.product.item.Quantity = combi.quantity;
     }
  }

  // function called by view for a change in currency
  onCurrencyChange(newCurrency : string) : void{
    this.shopService.emitEvent(new AppEvent(APP_EVENT_TYPES.currencyChange, newCurrency));
  }

  // called when user selects another variant and will workout the price
	updateProductPrice(priceElement : HTMLElement){
		if(this.product.item.Variants.variants.length > 0){
			let chosenArray = [];
			this.pickedSpec.forEach(function(variant){
				chosenArray.push(variant.name);
			})
			function combiMatches(combi){
				return JSON.stringify(combi.combination) == JSON.stringify(chosenArray);
			}
			let combi = this.product.item.Variants.combinations.find(combiMatches);
			let prevPrice = this.product.item.Price[this.config.preferences.currency.chosen.toLowerCase()];
			
			// only need to scroll or update price if there is a difference between the current 
			// and the previous price
			if(prevPrice != combi.price[this.config.preferences.currency.chosen.toLowerCase()]){
				this.product.item.Price = Object.assign(this.product.item.Price, combi.price);
        this.product.item.Quantity = combi.quantity;
        $([document.documentElement, document.body]).animate({
					scrollTop: $(priceElement).offset().top
				}, 1000);
			}
		}
	}

}
