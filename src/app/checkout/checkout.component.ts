import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ShopSpineService} from '../shop-spine.service'
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private shopService : ShopSpineService, private router : Router,
              private http : HttpClient) { }
  
  customer : any;
  config : any;
  foxpostTerminal = {
      list : null,
      showList : true,
      searchString: null
  };
  termsAccepted = false;

  ngOnInit(): void {
     this.shopService.getCustomerDetails().subscribe(customerDetails =>{
       this.customer = customerDetails;
     });
     this.shopService.getConfig().subscribe((config : any) =>{
       this.config = config;
       if(config.preferences.deliveryMethod == 'Foxpost-Terminal'){
          this.http.get('/assets/Foxpost-Delivery.json').subscribe(evt =>{
            this.foxpostTerminal.list = evt;
          })
       }
     })
  }

  // called after the customer has inputted checkout data. This function saves the customer
  // details and proceeds to the review page
  proceedToPayment():void {
     this.shopService.setCustomerDetails(this.customer);
    this.router.navigate(['/review']);
  }

}
