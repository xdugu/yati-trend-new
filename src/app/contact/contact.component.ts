import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiManagerService, API_METHOD, API_MODE} from '../api-manager.service'
import {ShopSpineService} from '../shop-spine.service'
import {HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private apiService : ApiManagerService,
              private shopService: ShopSpineService,
              private dialog : MatDialog,
              private router : Router) { }

  // model to store user entries
  user = {
     name: null,
     email: null,
     comments: "",
     requestType: 'Request',
     topic: "General",
     storeId: null
  }

  config = null;

  ngOnInit(): void {
      this.shopService.getConfig().subscribe(config =>{
         this.config = config;

         // set store if from config
         this.user.storeId = this.config.storeId;
      })
  }

  // called when the user submits a request
  onRequestSubmit(){

    // send request by post
    this.apiService.post(API_MODE.OPEN, API_METHOD.CREATE, 'request', new HttpParams(), this.user)
      .subscribe(() =>{
        const dialogConfirm = this.dialog.open(DialogDisplayRequestStatus, {
          data: {success: true}
        });

        // after showing of successful request is shown and closed, redirect user to homepage
        dialogConfirm.afterClosed().subscribe(()=>{
            this.router.navigate(['/']);
        });
      },
      (err)=>{
        console.log(err);
         this.dialog.open(DialogDisplayRequestStatus, {
          data: {success: false}
        });

      }
      )
  }



}


// component to show dialog confirming an order
@Component({
  selector: 'request-submit-result',
  templateUrl: 'request-submit-result.html',
})
export class DialogDisplayRequestStatus{

  constructor(
    public dialogRef: MatDialogRef<DialogDisplayRequestStatus>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}