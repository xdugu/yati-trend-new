import { Component, OnInit } from '@angular/core';
import { ApiManagerService, API_MODE, API_METHOD} from '../api-manager.service';
import { ShopSpineService} from '../shop-spine.service';
import {HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent implements OnInit {
  config = null;
  blog = null;

  constructor(private apiManager : ApiManagerService, private shopService : ShopSpineService,
              private routeInfo : ActivatedRoute) { 
    // get the website config
    this.shopService.getConfig().subscribe(evt =>{
        this.config = evt;

        // subscribeto current route info
        routeInfo.paramMap.subscribe(params =>{
        
        //set parameters to get blog
        let httpParams = new HttpParams()
            .set('storeId', this.config.storeId)
            .set('blogId', params.get('blogId'))

          //get blog
          apiManager.get(API_MODE.OPEN, API_METHOD.GET, 'blog', httpParams).subscribe((res : any) =>{
            this.blog = res;
          });
        });
        
        
    });
}

  ngOnInit(): void {
  }

}
