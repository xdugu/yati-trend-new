import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {asyncData} from '../../testing/async-observable-helpers';
import { FooterComponent } from './footer.component';
import { ShopSpineService } from '../shop-spine.service';
import {By} from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  // generate mock or partial service
  let shopServiceSub: Partial<ShopSpineService>;

  shopServiceSub = {
    getConfig: () => asyncData({preferences: {lang: 'hu'}})
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      imports: [RouterTestingModule],
      providers: [
        { provide: ShopSpineService, useValue: shopServiceSub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid "href" for all links', ()=>{
     let links = fixture.debugElement.queryAll(By.css('a'));
     links.forEach(link =>{
        expect(link.nativeElement.href).not.toBeNull();
     });
  });

  it('should have at least one link to legal page', ()=>{
    let links = fixture.debugElement.queryAll(By.css('a'));
    let index = links.findIndex(elem => elem.nativeNode.href.search('/legal') >= 0);
    expect(index).toBeGreaterThanOrEqual(0);
  })

  it('should show correct language text', ()=>{
    let elem: DebugElement;

    // try setting first lang test to hungarian
    component.config = {preferences: {lang : 'hu'}};
    fixture.detectChanges();
    elem = fixture.debugElement.query(By.css('#lang-selection'));
    expect(elem.nativeNode.children.length).toBe(1);
    expect(elem.nativeNode.children[0].innerHTML).toEqual('English');

    //try setting the next text to english
    component.config = {preferences: {lang : 'en'}};
    fixture.detectChanges();
    elem = fixture.debugElement.query(By.css('#lang-selection'));
    expect(elem.nativeNode.children.length).toBe(1);
    expect(elem.nativeNode.children[0].innerHTML).toEqual('Magyar');
  });



});
