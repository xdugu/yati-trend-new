import { Component, OnInit, Inject } from '@angular/core';
import {BasketService} from '../basket.service'
import {ShopSpineService} from '../shop-spine.service'
import { IPayPalConfig, ICreateOrderRequest} from 'ngx-paypal';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  paymentType: string;
  costs: any;
  countryCode: string;
  currency: string;
  courier:string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  private paypalIdTest = "ARepdsMSrfrrl7TM-WgW3OuVO1UXOTUGzCcfIn1kHc8kZ4dS35xA5MY13sPDYtrqDdL34lukvDkrr4gk";
	private paypalIdLive = "ARPzjpvRIiwqLcKb-idrLmOUOyinmWbEJnVk-xZJkNrB7ebehE7DXRPI60-xvvoBI1EI2Z_OLTWanD_k";

  constructor(private shopService: ShopSpineService,
              private basketService: BasketService,
              public dialog: MatDialog) { }
  
    public payPalConfig : any;
  
  basket = null; // stores data of items in basket
  config = null; // stores config e.g. currency
  customer = null;

  ngOnInit(): void {
    this.shopService.getConfig().subscribe(config =>{
       this.config = config;
    })

    // get basket (if exists)
    this.basketService.getBasket().subscribe(basket =>{
        this.basket = basket;
        this.createPaypalObject();
    })

    this.shopService.getCustomerDetails().subscribe(details => {
      this.customer = details;
    })

    this.shopService.childEventListener().subscribe((evt) => {
       this.shopService.getConfig().subscribe(config => {
          this.config = config;
       })
    })
 }

 // called by view when'bankTransfer' or 'payOnDelivery' is selected
 triggerPaymentMethod(method : string){
    const dialogRef = this.dialog.open(DialogConfirmPaymentMethod, {
      width: '250px',
      data: {paymentType: method, costs : this.basket.Costs, courier: this.config.preferences.deliveryMethod,
            countryCode: this.config.preferences.countryCode, currency: this.config.preferences.currency.chosen}
    });

    dialogRef.afterClosed().subscribe(result => {
       if(result == 'Confirmed'){
          this.basketService.order(method, 'Hello', {}).subscribe(res =>{
             if(!res){
                console.log("Order Fail");
             }
          })
       }
    });
 }

 // creates a paypal object that is able to make paypal payments
 private createPaypalObject(): void {
    this.payPalConfig = {
        currency: this.config.preferences.currency.chosen,
        clientId: this.paypalIdTest,
        createOrder: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            payer:{
              email_address:  this.customer.email,
              phone: {
                phone_number:{
                  national_number: this.customer.number.toString()
                  }
              }
            },
            purchase_units: [{
                amount: {
                    currency_code: this.config.preferences.currency.chosen,
                    value: this.basket.Costs[this.config.preferences.countryCode][this.config.preferences.deliveryMethod].payBeforeDelivery.total[this.config.preferences.currency.chosen.toLowerCase()].toString(),
                    breakdown: {
                        item_total: {
                            currency_code: this.config.preferences.currency.chosen,
                            value: this.basket.Costs[this.config.preferences.countryCode][this.config.preferences.deliveryMethod].payBeforeDelivery.subTotal[this.config.preferences.currency.chosen.toLowerCase()].toString()
                        },
                        discount: {
                          currency_code: this.config.preferences.currency.chosen,
                          value: this.basket.Costs[this.config.preferences.countryCode][this.config.preferences.deliveryMethod].payBeforeDelivery.discount[this.config.preferences.currency.chosen.toLowerCase()].toString()
                          
                        },
                        shipping: {
                          currency_code: this.config.preferences.currency.chosen,
                          value: this.basket.Costs[this.config.preferences.countryCode][this.config.preferences.deliveryMethod].payBeforeDelivery.delivery[this.config.preferences.currency.chosen.toLowerCase()].toString()
                        }
                    }
                },
                items: this.getPaypalBasketItems(this.basket.Items, this.config.preferences.currency.chosen, 'en')
            }]
        },
        payment_options: {
          allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
          },
        soft_descriptor: this.config.storeId,
        description: this.config.storeId,
			  custom_id: this.basket.BasketId,
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
    };
  }

  // creates an array of paypal items from basket items
  getPaypalBasketItems(items : any, currency : string, lang: string): any{
    let paypalItems = [];

    // loop through each item
    for(let i = 0; i < items.length; i++)
    {
      let itemName =  items[i].Title[lang];
      let wholeId = items[i].ItemId;
  
      if(items[i].Variants.variants.length > 0){
        for(let j = 0; j < items[i].Combination.length; j++){
          let combi = items[i].Combination[j];
          if(combi.hasOwnProperty('chosenVariant')){
            wholeId += ',' + combi.chosenVariant.Title[lang];
          }
          else
            wholeId += ',' + combi.text[lang];
        }
      }
      let price ={value:"", currency_code:currency};
  
      price.value = items[i].Price[currency.toLowerCase()].toString();
      
      paypalItems.push({name:itemName, sku:wholeId, unit_amount:price, quantity:items[i].Quantity.toString(), currency:currency, category:'PHYSICAL_GOODS'});		
    }
    
    return paypalItems;
  }
}

@Component({
  selector: 'dialog-confirm-payment-method',
  templateUrl: 'dialog-confirm-payment-method.html',
})
export class DialogConfirmPaymentMethod{

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmPaymentMethod>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}


