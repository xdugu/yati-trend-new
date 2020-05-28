import { Component, OnInit, Inject, ElementRef, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ShopSpineService} from '../shop-spine.service'
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import {MatCheckboxChange} from '@angular/material/checkbox';
import 'jquery';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private shopService : ShopSpineService, private router : Router,
              private http : HttpClient, private dialog: MatDialog,
              private element : ElementRef) { }
  
  customer : any;
  config : any;
  foxpostTerminal = {
      list : null,
      showList : false,
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
          this.clearAddressData();
          this.http.get('/assets/Foxpost-Delivery.json').subscribe(evt =>{
            this.foxpostTerminal.list = evt;
            this.foxpostTerminal.showList = true;
          })
       }
     })
  }

  // called when address is selected from list
  triggerFoxpostAddressDialog(place){
    const dialogConfirm = this.dialog.open(DialogShowFoxpostAddress, {
      data: place
    });
    dialogConfirm.afterClosed().subscribe(resp =>{
       if(resp == 'Confirmed'){
         this.customer.address1 = 'Foxpost';
         this.customer.address2 = place.Address;
         this.customer.city = place.City;
         this.customer.postCode = place.PostCode;
         this.foxpostTerminal.showList = false;
       }
    })
  }

  // primary clled when the customer elects to choose a new foxpost address
  // after previously choosing one
  clearAddressData():void{
    this.customer.address1 = null;
    this.customer.address2 = null;
    this.customer.city = null;
    this.customer.postCode = null;
    this.shopService.setCustomerDetails(this.customer);
    if(this.config.preferences.deliveryMethod == 'Foxpost-Terminal'){
       this.foxpostTerminal.showList = true;
    }
  }

  // called after the customer has inputted checkout data. This function saves the customer
  // details and proceeds to the review page
  proceedToPayment():void {
     this.shopService.setCustomerDetails(this.customer);
    this.router.navigate(['/review']);
  }

  // called when the checkbox is selected or deselcted for accepting the terms change
  onTermsChange(event : MatCheckboxChange){
     if(event.checked){
          $([document.documentElement, document.body]).animate({
              scrollTop: $('#proceedButton').offset().top
          }, 2000);
     }
  }

}

// component to show dialog for user to confirm order action
@Component({
  selector: 'dialog-foxpost-address-viewer',
  templateUrl: 'dialog-foxpost-address-viewer.html',
})
export class DialogShowFoxpostAddress{

  constructor(
    public dialogRef: MatDialogRef<DialogShowFoxpostAddress>,
    @Inject(MAT_DIALOG_DATA) public data) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}
