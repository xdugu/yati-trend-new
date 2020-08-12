// This file tests the ui interaction of the header component
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { HeaderComponent } from './header.component';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { ShopSpineService, AppEvent } from '../shop-spine.service';
import {asyncData} from '../../testing/async-observable-helpers';
import {APP_EVENT_TYPES} from'../shop-spine.service';
import { BasketService } from '../basket.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

describe('HeaderUITest', () => {

    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    let shopServiceSub: Partial<ShopSpineService>;
    let basketServiceSub: Partial<BasketService>;

    shopServiceSub = {
        childEventListener: () => asyncData(new AppEvent(APP_EVENT_TYPES.basketNumber, 1))
    };
    basketServiceSub = {
        getBasketCount: () => asyncData(1)
    }

    beforeEach((async () => {
        TestBed.configureTestingModule({
          imports: [MatMenuModule, MatBadgeModule],
          declarations: [ HeaderComponent],
          providers: [
            { provide: ComponentFixtureAutoDetect, useValue: true }, // auto draw ui after change in variables
            { provide: BasketService, useValue: basketServiceSub },
            { provide: ShopSpineService, useValue: shopServiceSub }
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance; // Header test instance
    }));

    it('should change basket number', ()=>{
        let elem : any;

        // test basket number is viewable on mobile screens
        component.screenState = 'mobile';
        component.basketNumber = 3;
        fixture.detectChanges();
        elem = fixture.nativeElement.querySelector('.basketNum');
        expect(elem.children[0].innerHTML).toBe('3');

        // test basket number is viewable on tablet screens
        component.screenState = 'tablet';
        component.basketNumber = 4;
        fixture.detectChanges();
        elem = fixture.nativeElement.querySelector('.basketNum');
        expect(elem.children[0].innerHTML).toBe('4');

        // test basket number is viewable on wide screens
        component.screenState = 'wide_screen';
        component.basketNumber = 5;
        fixture.detectChanges();
        elem = fixture.nativeElement.querySelector('.basketNum');
        expect(elem.children[0].innerHTML).toBe('5');
    })

    it('should trigger a menu click event', ()=>{
        component.screenState = 'mobile';
        fixture.detectChanges();
        let elem = fixture.debugElement.query(By.css('.test_menu_icon'));
        expect(elem).toBeTruthy();
        spyOn(component, 'toggleMenu');
        elem.triggerEventHandler('click', null);
        expect(component.toggleMenu).toHaveBeenCalled(); 
    })

    it('should check that all buttons have listeners', ()=>{

        let viewsToTest = ['mobile', 'tablet', 'wide_screen'];

        viewsToTest.forEach(view =>{        
            component.screenState = view;
            fixture.detectChanges();
            let elems = fixture.debugElement.queryAll(By.css('button'));
            expect(elems.length).toBeGreaterThan(0);
            elems.forEach((elem, index) =>{
                expect(elem.listeners.length).toBeGreaterThan(0, view + ' ' + index.toString());
            });
        })
    })
});

