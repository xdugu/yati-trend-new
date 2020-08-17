import { Directive, ElementRef } from '@angular/core';
import { interval } from 'rxjs';
import 'jquery';

@Directive({
  selector: '[appImageSizer]'
})
export class ImageSizerDirective {


  constructor(private el: ElementRef) {
  }


    ngAfterContentInit(){
      let myInterval = interval(1000);
      let lastSize = 0;

      // create timer to continously check that images have the same size
      myInterval.subscribe(()=>{
        let elem = this.el.nativeElement;
        let indexOfShortestImage = 0;
			  let shortestHeight = 2000;
			  let images = $(elem).find('img');
			  for(let i = 0; i < images.length; i++){

          // if images have not been loaded, we cannot know their size
				  if(!images[i].complete)
					  return;
				  if(images[i].height < shortestHeight && images[i].src != null)
				  {
					  shortestHeight = images[i].height;
					  indexOfShortestImage = i;
				  }
			  }
			  if(shortestHeight != lastSize && shortestHeight != 2000){
				  //check if image has changed size and that also all the images are not just loading gifs
			  for(let i =0; i <images.length; i++){
				  let diff = shortestHeight - images[i].height;
				  $(images[i]).css({'margin-bottom':  diff.toString() + 'px'})
			  }
			   lastSize = shortestHeight;
			  }

      })
    }
       
}
