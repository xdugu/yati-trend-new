import { Directive, Input, ElementRef, SimpleChanges } from '@angular/core';
import 'jquery';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective {

  constructor(private elemRef : ElementRef) { }
  // input to real img src to lazy load
  @Input('appLazyLoad') src : string;
  private wasVisible = false;

  ngAfterContentInit(){
    // get referenc to elemet
    let elem = this.elemRef.nativeElement;
    let cssHeight = $(elem).css('height');
    $(elem).css('height', '1000px');

    // set options for margins for observer
			let options = {
				root: null,
				rootMargin: '30% 10% 80% 10%', //setting margin to prempt loading
				threshold: 0
			}
      
      const observer = new IntersectionObserver(loadImg, options);           
      observer.observe(elem)

      // save reference to private variable to be used in function
      var privateVar = this;
      function loadImg(changes : any){
          changes.forEach((change) =>{
            // check if image can be seen
              if(change.intersectionRatio > 0){
                if(!change.target.src.includes(privateVar.src) && privateVar.src != undefined){
                  change.target.src = privateVar.src;

                  // readjust image height
                  $(elem).css('height', cssHeight == '0px'? 'auto': cssHeight);
                  privateVar.wasVisible = true;
                  // unobserve element after setting src
                  observer.unobserve(elem);
                }
              }
          })
      } 
  }

  // watch for changes in the appLazyLoad input in case a new image needs to be loaded
  ngOnChanges(changes: SimpleChanges) {

    if(this.wasVisible){
      this.elemRef.nativeElement.src = changes.appLazyLoad.currentValue;
    }

``}

}
