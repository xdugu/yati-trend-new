import { Directive, ElementRef, Input} from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Directive({
  selector: '[appHtmlEmbed]'
})

// This class takes in a url path to an html file and embeds the result inside
// the called element
export class HtmlEmbedDirective {

  @Input('appHtmlEmbed') path : string;

  constructor(private el : ElementRef, private http : HttpClient) { }

  ngOnInit(){
    this.http.get(this.path, {responseType: 'text'}).subscribe(resp => {
       this.el.nativeElement.innerHTML = resp;
    },
      err =>{
       console.log(err);
    });
  
  }

}
