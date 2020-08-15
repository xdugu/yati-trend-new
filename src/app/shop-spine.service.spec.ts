import { TestBed } from '@angular/core/testing';

import { ShopSpineService, AppEvent, APP_EVENT_TYPES } from './shop-spine.service';
import { asyncData } from 'src/testing/async-observable-helpers';
import { setTimeout } from 'timers';

describe('ShopSpineService', () => {
  let service: ShopSpineService;
  let httpService: {get: jasmine.Spy}
  let storageService: {setString: jasmine.Spy, getString: jasmine.Spy, 
                      getObj: jasmine.Spy, setObj: jasmine.Spy};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpService = jasmine.createSpyObj('HttpClient', ['get']);
    storageService = jasmine.createSpyObj('TokenStorageService', 
                        ['setString', 'getString', 'getObj', 'setObj']);
    localStorage.clear();
  });

  it('should get shopping details', () => {
    service = new ShopSpineService(httpService as any, storageService as any, 'hu');
     expect(storageService.getObj.calls.count()).toBe(1);
  });

  it('should handle event emitting correctly', (done)=>{
     storageService.getObj.and.returnValue(null);
     httpService.get.and.returnValue(
         asyncData({preferences: {lang: 'hu', currency:{chosen: 'EUR'}, deliveryMethod: 'Posta'},'version': 1,
                  shopping: {contact:{firstName: 'TestUser', lang: 'hu', countryCode: 'HU'}}
         })
      );
     service = new ShopSpineService(httpService as any, storageService as any, 'hu');
     
     service.emitEvent(new AppEvent(APP_EVENT_TYPES.currencyChange, 'HUF'));
     service.getConfig().subscribe((config: any) =>{
        expect(config.preferences.currency.chosen).toEqual('HUF');
        done();
     });

     // check that a change in the country code is properly propagated
     service.emitEvent(new AppEvent(APP_EVENT_TYPES.countryCode, 'GB'));
      service.getConfig().subscribe((config: any) =>{
            expect(config.preferences.countryCode).toEqual('GB');
            done();
      }
      );
     service.getCustomerDetails().subscribe((details: any)=>{
         expect(details.countryCode).toEqual('GB');
         done();
     })

     // check the delivery method change is properly propagated
     service.emitEvent(new AppEvent(APP_EVENT_TYPES.deliveryMethod, 'GLS'));
     service.getConfig().subscribe((config: any) =>{
      expect(config.preferences.deliveryMethod).toEqual('GLS');
      done();
     });
     
  }); //it


  it('should get correct lang in preferences', (done)=>{
   storageService.getObj.and.returnValue(null);
   httpService.get.and.returnValue(
       asyncData({preferences: {lang: 'hu', currency:{chosen: 'EUR'}, deliveryMethod: 'Posta'},'version': 1,
                shopping: {contact:{firstName: 'TestUser', lang: 'hu', countryCode: 'HU'}}
       })
    );

    service = new ShopSpineService(httpService as any, storageService as any, 'en');

    service.getConfig().subscribe((config:any) =>{
       expect(config.preferences.lang).toBe('en');
       done();
    })

  });
});
