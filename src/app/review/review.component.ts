import { Component, OnInit, Inject } from '@angular/core';
import {BasketService} from '../basket.service'
import {ShopSpineService} from '../shop-spine.service'
import { IPayPalConfig, ICreateOrderRequest} from 'ngx-paypal';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// data interface for dialogs
export interface DialogData {
  paymentType: string;
  costs ?: any;
  countryCode ?: string;
  currency ?: string;
  courier ?:string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css', '../app.component.css']
})
export class ReviewComponent implements OnInit {
  private paypalIdTest = "ARepdsMSrfrrl7TM-WgW3OuVO1UXOTUGzCcfIn1kHc8kZ4dS35xA5MY13sPDYtrqDdL34lukvDkrr4gk";
	private paypalIdLive = "ARPzjpvRIiwqLcKb-idrLmOUOyinmWbEJnVk-xZJkNrB7ebehE7DXRPI60-xvvoBI1EI2Z_OLTWanD_k";

  constructor(private shopService: ShopSpineService,
              private basketService: BasketService,
              public dialog: MatDialog,
              private router : Router) { }
  
    public payPalConfig : any;
  
  basket = null; // stores data of items in basket
  config = null; // stores config e.g. currency
  customer = null;

  ngOnInit(): void {
    this.shopService.getConfig().subscribe(config =>{
       this.config = config;
       this.shopService.getCustomerDetails().subscribe(details => {
            // get basket (if exists)
            this.basketService.getBasket().subscribe(basket =>{
              this.basket = basket;
              this.customer = details;
               this.createPaypalObject();
          }) 
      })
    })

    this.shopService.childEventListener().subscribe((evt) => {
       this.shopService.getConfig().subscribe(config => {
          this.config = config;
       })
    })
 }

 // called by view when 'bankTransfer' or 'payOnDelivery' is selected
 triggerPaymentMethod(method : string){
    const dialogConfirm = this.dialog.open(DialogConfirmPaymentMethod, {
      width: '250px',
      data: {paymentType: method, costs : this.basket.Costs, courier: this.config.preferences.deliveryMethod,
            countryCode: this.config.preferences.countryCode, currency: this.config.preferences.currency.chosen}
    });

    dialogConfirm.afterClosed().subscribe(result => {
       if(result == 'Confirmed'){
          this.basketService.order(method, 'Hello', {}).subscribe(res =>{
             if(res){
                this.confirmOrder(method);
             }
          })
       }
    });
 }

   confirmOrder(paymentType : string){
         // if order payment successful
         const dialogSuccess = this.dialog.open(DialogConfirmOrderSuccessful, {
          width: '250px',
          data: {paymentType: paymentType}
        });
        dialogSuccess.afterClosed().subscribe(()=>{
            this.router.navigate(['/']);
        });
   }

 // creates a paypal object that is able to make paypal payments
 private createPaypalObject(): void {
    this.payPalConfig = {
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
                items: this.getPaypalBasketItems(this.basket.Items, this.config.preferences.currency.chosen, 'en'),
                shipping:{
                    name:{full_name: this.customer.firstName},
                    address: {
                      address_line_1: this.customer.address1,
                      address_line_2: this.customer.address2,
                      admin_area_2: this.customer.city,
                      country_code: this.customer.countryCode,
                      postal_code: this.customer.postCode,
                    }
                  }
            }]
        },
        payment_options: {
          allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
          },
        soft_descriptor: this.config.storeId,
        description: this.config.storeId,
			  custom_id: this.basket.BasketId,
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'pill',
            label: 'checkout'
        },
        onApprove: (data, actions) => {
            actions.order.get().then((details : any) => {
                this.basketService.order('paypal', 'HelloPaypal', details).subscribe(res =>{
                  if(res){
                    this.confirmOrder('paypal');
                  }
              });
            });

        },
        onError: err => {
          console.log('OnError', err); 
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

// component to show dialog for user to confirm order action
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

// component to show dialog confirming an order
@Component({
  selector: 'dialog-confirm-order-successful',
  templateUrl: 'dialog-confirm-order-successful.html',
})
export class DialogConfirmOrderSuccessful{

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmPaymentMethod>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}


