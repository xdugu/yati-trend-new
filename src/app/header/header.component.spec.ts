import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {asyncData} from '../../testing/async-observable-helpers'

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let breakpointSpy: { observe: jasmine.Spy};
  let shopSpy: { childEventListener: jasmine.Spy};
  let basketSpy: {getBasketCount : jasmine.Spy};

  // setup mocks before each test
  beforeEach(()=>{
     breakpointSpy = jasmine.createSpyObj('breakpointObserver', ['observe']);
     shopSpy = jasmine.createSpyObj('ShopSpineService', ['childEventListener']);
     basketSpy = jasmine.createSpyObj('BasketService', ['getBasketCount']);
  });

  // test that event is emitted toggle menu button is pressed
  it('raises the selected event when clicked', () => {
      breakpointSpy.observe.and.returnValue(asyncData({matches: false}));
      component = new HeaderComponent(breakpointSpy as any, shopSpy as any, basketSpy as any);
      spyOn(component.sideNavToggleEvent, 'emit');
      component.toggleMenu();
      expect(component.sideNavToggleEvent.emit).toHaveBeenCalled();
  });

  it('should set screen state to "mobile"', (done) =>{
      breakpointSpy.observe.and.returnValues(asyncData({matches: true}), asyncData({matches: false}), asyncData({matches: false}));
      component = new HeaderComponent(breakpointSpy as any, shopSpy as any, basketSpy as any);
      
      // need to give time to resolve screen state
      setTimeout(()=>{ expect(component.screenState).toBe('mobile'); done();}, 1);
  });

   it('should set screen state to "tablet"', (done) =>{
      breakpointSpy.observe.and.returnValues(asyncData({matches: false}), asyncData({matches: true}), asyncData({matches: false}));
      component = new HeaderComponent(breakpointSpy as any, shopSpy as any, basketSpy as any);

      // need to give time to resolve screen state
      setTimeout(()=>{ expect(component.screenState).toBe('tablet'); done();}, 1);
     
   });

   it('should set screen state to "wide_screen"', (done) =>{
      breakpointSpy.observe.and.returnValues(asyncData({matches: false}), asyncData({matches: false}), asyncData({matches: true}));
      component = new HeaderComponent(breakpointSpy as any, shopSpy as any, basketSpy as any);
      
      // need to give time to resolve screen state
      setTimeout(()=>{ expect(component.screenState).toBe('wide_screen'); done();}, 1);
   });
   

});
