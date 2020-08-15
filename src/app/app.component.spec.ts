import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ShopSpineService} from './shop-spine.service';
import {asyncData} from '../testing/async-observable-helpers';
import { MatTreeModule } from '@angular/material/tree';
import { DebugElement } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {

  // setup partial moch of ShopSpineService
  let shopServiceSub: Partial<ShopSpineService>;
  let fixture : ComponentFixture<AppComponent>;
  let component: AppComponent;

  shopServiceSub = {
    getConfig: () => asyncData({preferences: {'lang': 'en'}})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, MatTreeModule, MatSidenavModule, BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers:[
        { provide: ShopSpineService, useValue: shopServiceSub }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', () => {
    
    expect(component).toBeTruthy();
  });

  // Check that a side nav events changes the corresponding variable to true/false
  it('should show and hide side nav', ()=>{
     component.sideNav.opened = true;
     component.sideNavEvent();
     expect(component.sideNav.opened).toBeFalse();
  });

  // checks that we can control the side nav's appearances and disapperances
  it('show a menu is linked to nav click', ()=>{
        let elem : DebugElement;

        // menu should be visible
        component.sideNav.opened = true;
        fixture.detectChanges();
        elem = fixture.debugElement.query(By.css('mat-sidenav'));
        expect(elem.attributes['ng-reflect-opened']).toBe("true");

        // menu should invisible
        component.sideNav.opened = false;
        fixture.detectChanges();
        elem = fixture.debugElement.query(By.css('mat-sidenav'));
        expect(elem.attributes['ng-reflect-opened']).toBe("false");

  });

});
