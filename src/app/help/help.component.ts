import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor(public http : HttpClient) { }

  cache = {};

  ngOnInit(): void {
  }

  // called by view to get html page
  getHtmlPage(url : string){
    return new Observable(sub => {
      if(this.cache[url] == null){
      this.http.get(url, {responseType: 'text'}).subscribe(evt => {
          this.cache[url] = evt;
          sub.next(evt);
        },
          err =>{
           console.log(err);
        });
      }else
        sub.next(this.cache[url]);
    });

  }


}
