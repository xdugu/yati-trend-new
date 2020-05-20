import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
              private http : HttpClient, private dialog: MatDialog) { }
  
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

  // calledwhen address is selected from list
  triggerFoxpostAddressDialog(place){
    const dialogConfirm = this.dialog.open(DialogShowFoxpostAddress, {
      data: place
    });
    dialogConfirm.afterClosed().subscribe(resp =>{
       if(resp == 'Confirmed'){
         this.customer.address1 = 'Foxpost ' + place.Address;
         this.customer.city = place.City;
         this.customer.postCode = place.PostCode;
         this.foxpostTerminal.showList = false;
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
