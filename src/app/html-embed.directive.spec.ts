import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed, async } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { asyncData } from 'src/testing/async-observable-helpers';
import { HtmlEmbedDirective } from './html-embed.directive';

@Component({
    template: `
    <p [appHtmlEmbed]="'/path/to/text.html'"></p>
    `  
})

class TestComponent { }


describe('HtmlEmbedDirective', () => {
    let des: DebugElement;
    let fixture: ComponentFixture<TestComponent>;
    let httpMock: {get: jasmine.Spy}

    httpMock = jasmine.createSpyObj('HttpClient', ['get']);


    beforeEach(() => {
        httpMock.get.and.returnValue(asyncData('<h1>Some Title</h1>'));

        fixture = TestBed.configureTestingModule({
          declarations: [ HtmlEmbedDirective, TestComponent ],
          providers:[
            { provide: HttpClient, useValue: httpMock}
          ]
        })
        .createComponent(TestComponent);
      
        fixture.detectChanges(); // initial binding

        // all elements with an attached HighlightDirective
        des = fixture.debugElement.query(By.directive(HtmlEmbedDirective));
      
      });

    it('should embed html into given element', (done)=>{
        setTimeout(()=>{
            expect(des.nativeElement.innerHTML).toBe('<h1>Some Title</h1>');
            done();
        }, 1) 
    })

});