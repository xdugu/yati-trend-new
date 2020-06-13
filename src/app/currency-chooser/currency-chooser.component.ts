import { Component, OnInit, EventEmitter, Output, Input, ElementRef} from '@angular/core';
import 'jquery'

@Component({
  selector: 'app-currency-chooser',
  templateUrl: './currency-chooser.component.html',
  styleUrls: ['./currency-chooser.component.css']
})


export class CurrencyChooserComponent implements OnInit {

//chosen is a 'string' of the chosen currency e.g. HUF
 @Input() chosen: string;
 // available is a string array of available currencies e.g. ['HUF', 'GBP']
 @Input() available: string[];

 @Input() position: string;
// We emit this event when user changes the currency they prefer
 @Output() currencyChange = new EventEmitter();


  constructor(private el: ElementRef) {
   }

  ngOnInit():void{
  }

  // we need to better position the position of the currency chooser
  ngAfterViewInit(): void {
    let elem = this.el.nativeElement;
    let chipList = $(elem).find('mat-chip-list')[0];

    if(this.position == null || this.position == undefined || this.position == 'center'){       
      let chips = $(chipList).find('mat-chip');  
      let totalWidth = 0;
      for(let i = 0; i < chips.length; i++){
        totalWidth += $(chips[i]).outerWidth() + 30;
      }
      $($(chips[0]).parent()).css({'width': totalWidth - 30, 'margin': '0px auto'});
    }
  }

  // called to emit event for currency change
  onCurrencyChange(chosenCurrency : string){
    this.currencyChange.emit(chosenCurrency);
  }

}
