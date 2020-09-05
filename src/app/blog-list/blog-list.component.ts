import { Component, OnInit } from '@angular/core';
import { ApiManagerService, API_MODE, API_METHOD} from '../api-manager.service';
import { ShopSpineService} from '../shop-spine.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})

// Class to view blog posts
export class BlogListComponent implements OnInit {
  config = null;
  list = null;

  constructor(private apiManager : ApiManagerService, private shopService : ShopSpineService) { 
      // get the website config
      this.shopService.getConfig().subscribe(evt =>{
          this.config = evt;
          let httpParams = new HttpParams()
            .set('storeId', this.config.storeId)
      
          // get list of blogs
          apiManager.get(API_MODE.OPEN, API_METHOD.GET, 'blogs', httpParams).subscribe((res : any) =>{
              this.list = res;
          })
          
      });
  }

  ngOnInit(): void {

  }

}
