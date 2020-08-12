import { TestBed } from '@angular/core/testing';
import { ApiManagerService, API_MODE, API_METHOD } from './api-manager.service';
import {HttpParams} from '@angular/common/http';
import {asyncData} from '../testing/async-observable-helpers'

describe('ApiManagerService', () => {
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy};
  let service: ApiManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    //service = TestBed.inject(ApiManagerService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    service = new ApiManagerService(httpClientSpy as any);
  });


  it('should call "get" and return expected result', () =>{
     let expectedOutput = {'Result': 'OK'};
     httpClientSpy.get.and.returnValue(asyncData(expectedOutput));

     service.get(API_MODE.OPEN, API_METHOD.GET, '', new HttpParams()).subscribe(res=>{
       expect(res).toEqual(expectedOutput, 'expectedOutput');
     });

     expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  })

  it('should call "post" and return expected result', () =>{
    let expectedOutput = {'Result': 'OK'};
    httpClientSpy.post.and.returnValue(asyncData(expectedOutput));

    service.post(API_MODE.OPEN, API_METHOD.GET, '', new HttpParams(), {}).subscribe(res=>{
      expect(res).toEqual(expectedOutput, 'expectedOutput');
    });

    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
 })
});
