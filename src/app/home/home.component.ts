import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeSlidesConfig = {
      slick: {
        "slidesToShow": 2, "slidesToScroll": 1, "arrows": true
      },
      images:[
        "assets/images/home/img1.jpg",
        "assets/images/home/img2.jpg",
        "assets/images/home/img3.jpg",
      ]
    }
  
  constructor() { }

  ngOnInit(): void {
  }

}
