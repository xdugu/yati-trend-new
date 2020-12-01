import { Component, OnInit} from '@angular/core';
import { ApiManagerService, API_MODE, API_METHOD} from '../api-manager.service';
import { ShopSpineService } from '../shop-spine.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  config = null;
  blogList = null;

  homeSlidesConfig = {
      slick: {
        "slidesToShow": 3, "slidesToScroll": 1, "arrows": false, "dots": false,
        "infinite": false,
        responsive:[
          {
            breakpoint: 600,
            settings:{
              "slidesToShow": 2, "slidesToScroll": 1, "arrows": true, "dots": true
            }
          }
      ]
      },

    }
  
  constructor(private apiManager : ApiManagerService, private shopService : ShopSpineService) { }

  ngOnInit(): void {

    this.shopService.getConfig().subscribe(config =>{
       this.config = config;

       let httpParams = new HttpParams()
                            .set('storeId', this.config.storeId)
                            .set('lang', this.config.preferences.lang)
       this.apiManager.get(API_MODE.OPEN, API_METHOD.GET, 'blogs', httpParams).subscribe((list : any) =>{
          // get list of first four item in blog
          this.blogList = list.filter((_, index:number) => index < 4);
       })
    })
     
  }



}
