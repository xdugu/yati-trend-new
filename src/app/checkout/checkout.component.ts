import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ShopSpineService} from '../shop-spine.service'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private shopService : ShopSpineService) { }
  
  customer : any;
  termsAccepted = false;

  ngOnInit(): void {
     this.shopService.getCustomerDetails().subscribe(customerDetails =>{
       this.customer = customerDetails;
     })
  }

}
