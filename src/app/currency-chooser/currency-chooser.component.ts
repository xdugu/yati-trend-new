import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

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
// We emit this event when user changes the currency they prefer
 @Output() currencyChange = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  // called to emit event for currency change
  onCurrencyChange(chosenCurrency : string){
    this.currencyChange.emit(chosenCurrency);
  }

}
