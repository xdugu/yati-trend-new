import { Directive, ElementRef, Input } from '@angular/core';
import { interval } from 'rxjs';
import 'jquery';

@Directive({
  selector: '[appFitToChild]' 
})

// This class, given the id of a child to watch will match the
//height of that child with all the other children of the element
export class FitToChildDirective {
  @Input('appFitToChild') targetElem;

  constructor(private el: ElementRef) { }

  ngAfterContentInit(){
    let myInterval = interval(1000);
    this.fitToChild();
    myInterval.subscribe(()=>{
      this.fitToChild();
    })
  }

  // Function that checks siblings of given input and changes heights
  fitToChild(){
    let targetHeight = this.targetElem.height;

    let siblings = $(this.targetElem).siblings();
    for(let i = 0; i < siblings.length; i++){
      $(siblings[i]).css({'height': targetHeight, 'overflow-y': 'hidden'});
    }
  }

}
