import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  
  constructor() { }

  ngOnInit(): void {
  }

}
