import { TestBed } from '@angular/core/testing';
import {asyncData} from '../testing/async-observable-helpers'
import { BasketService } from './basket.service';
import { API_METHOD, API_MODE } from './api-manager.service';

describe('BasketService', () => {

  // create mock api manager and shop service
  let apiManagerSpy: { get: jasmine.Spy, post: jasmine.Spy};
  let shopServiceSpy: { emitEvent: jasmine.Spy, getCustomerDetails: jasmine.Spy, getConfig: jasmine.Spy};
  let storageSpy:{setString: jasmine.Spy, getString: jasmine.Spy, removeItem: jasmine.Spy};
  let service: BasketService;

  // before each test, initialise service and pass mocks
  beforeEach(() => {
    TestBed.configureTestingModule({});
    apiManagerSpy = jasmine.createSpyObj('ApiManager', ['get', 'post']);
    shopServiceSpy = jasmine.createSpyObj('ShopSpineService', ['emitEvent', 'getCustomerDetails', 'getConfig'])
    storageSpy = jasmine.createSpyObj('TokenStorageService', ['setString', 'getString', 'removeItem']);

    //mock getting a basket if
    storageSpy.getString.and.returnValue('FAKEBASKETID');

    // set the mock test config
    shopServiceSpy.getConfig.and.returnValue(asyncData({
      storeId: 'TestStore',
      preferences: {
        countryCode: 'HU',
        currency: {
          chosen: 'huf'
        },
        deliveryMethod: 'Posta'
      }
    }));

    // set the count in the basket to 3
    apiManagerSpy.post.and.returnValue(asyncData({BasketId: 'FAKEBASKETID', Count: 3}));
  });

  it('should get the basket count', (done) =>{

      // set the count in the basket to 3
      apiManagerSpy.post.and.returnValue(asyncData({Count: 3}));

      service = new BasketService(apiManagerSpy as any, shopServiceSpy as any, storageSpy as any);
      service.getBasketCount().subscribe(res => {
         expect(res).toBe(3);
         done();
      })

  });

  it('should return a basket',(done) =>{
      // set the count in the basket to 3
      apiManagerSpy.post.and.returnValue(asyncData({BasketId: 'FAKEBASKETID', Count: 3}));

      // instantiate service and check
      service = new BasketService(apiManagerSpy as any, shopServiceSpy as any, storageSpy as any);
      service.getBasket(false).subscribe(res => {
         expect(res).toEqual({BasketId: 'FAKEBASKETID', Count: 3});

         // call get again, check results and check that it gets data from cache rather than cloud
         service.getBasket(false).subscribe(res2 => {
            expect(res2).toEqual({BasketId: 'FAKEBASKETID', Count: 3});
            expect(apiManagerSpy.post.calls.count()).toBe(1);

            // expect force 'noCache' to fetch from server
            service.getBasket(true).subscribe(res => {
              expect(res).toEqual({BasketId: 'FAKEBASKETID', Count: 3});
              expect(apiManagerSpy.post.calls.count()).toBe(2);
              done();
            });
        });
      });

    }); //it


    it('should perform correct actions after addition to basket', (done)=>{
          // instantiate service and check
        service = new BasketService(apiManagerSpy as any, shopServiceSpy as any, storageSpy as any);

        // expect the basket to return some items and call the right functions
        service.addToBasket('FAKE_ITEM', {}).subscribe(res =>{
          expect(res).toEqual({BasketId: 'FAKEBASKETID', Count: 3});
          expect(storageSpy.setString.calls.count()).toBe(1);
          expect(shopServiceSpy.emitEvent.calls.count()).toBe(1);
          expect(apiManagerSpy.post.calls.count()).toBe(1);
          done();
        })
    }) // it

    it('should return basket after quantity change', (done)=>{
      // instantiate service and check
      service = new BasketService(apiManagerSpy as any, shopServiceSpy as any, storageSpy as any);

      service.changeQuantity(0, 3).subscribe(res =>{
        expect(res).toEqual({BasketId: 'FAKEBASKETID', Count: 3});

        //get basket again and expect results to be returned from cache

        apiManagerSpy.post.and.returnValue(asyncData({BasketId: 'FAKEBASKETID', Count: 4}));
        service.getBasket().subscribe(basket =>{
          expect(basket).toEqual({BasketId: 'FAKEBASKETID', Count: 3});
          expect(apiManagerSpy.post.calls.count()).toBe(1);
          done();
        })
      })

    });

    it('should return basket after item removal', (done)=>{
      // instantiate service and check
      service = new BasketService(apiManagerSpy as any, shopServiceSpy as any, storageSpy as any);

      service.removeItem(2).subscribe(res =>{
        expect(res).toEqual({BasketId: 'FAKEBASKETID', Count: 3});
        done();
      });
    });

    // This testcase checks that calling the 'order' function correctly attempts to place an order
    it('should place order', (done)=>{

      shopServiceSpy.getCustomerDetails.and.returnValue(asyncData({'name': 'Fake Name'}));
      
      //Check the inputs of the call to the service
      apiManagerSpy.post.and.callFake((apiMode, apiMethod, pathRest, _, msg)=>{
          expect(apiMode).toBe(API_MODE.OPEN);
          expect(apiMethod).toBe(API_METHOD.UPDATE);
          expect(pathRest).toEqual('basket/order');

          expect(msg.basketId).toEqual('FAKEBASKETID');
          expect(msg.storeId).toEqual('TestStore');
          expect(msg.hasOwnProperty('orderDetails')).toBeTrue();

          expect(msg.orderDetails.hasOwnProperty('contact')).toBeTrue();
          expect(msg.orderDetails.currency).toEqual('huf');
          expect(msg.orderDetails.paymentMethod).toEqual('payBeforeDelivery');
          expect(msg.orderDetails.comments).toEqual('TestComment');
          return asyncData(true);
      });

      //instantiate service
      service = new BasketService(apiManagerSpy as any, shopServiceSpy as any, storageSpy as any);

      // perform order and test results
      service.order('paypal', 'TestComment', {}).subscribe(res=>{
          expect(res).toBeTrue();
          expect(apiManagerSpy.post.calls.count()).toBe(1);
          expect(storageSpy.removeItem.calls.count()).toBe(1);
          expect(shopServiceSpy.emitEvent.calls.count()).toBe(1);
          done();
      });
    });
      
});
