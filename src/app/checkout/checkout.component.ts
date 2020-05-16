import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ShopSpineService} from '../shop-spine.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private shopService : ShopSpineService, private router : Router) { }
  
  customer : any;
  termsAccepted = false;

  ngOnInit(): void {
     this.shopService.getCustomerDetails().subscribe(customerDetails =>{
       this.customer = customerDetails;
     })
  }

  // called after the customer has inputted checkout data. This function saves the customer
  // details and proceeds to the review page
  proceedToPayment():void {
     this.shopService.setCustomerDetails(this.customer);
    this.router.navigate(['/review']);
  }

}
