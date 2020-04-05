import { Component, OnInit } from '@angular/core';
import {ApiManagerService, API_MODE, API_METHOD} from '../api-manager.service';
import {HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  constructor(private routeInfo: ActivatedRoute, private apiService: ApiManagerService) { }

  // store received catagory data in the 'items' property
  category = {
    items: null
  }
  ngOnInit(): void {
    let params = this.routeInfo.queryParams;
    params.subscribe(path => {
      this.getCategoryData(path);
    })
    
  }

  //This function will call the api service to get the items in the category
  private getCategoryData(path){
    let httpParams = new HttpParams()
              .set('category', path.category)
              .set('storeId', path.storeId + '>Product');

    let resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'category', httpParams);
    resp.subscribe(evt =>{
      this.category.items = evt[0];
    })


  }

}
