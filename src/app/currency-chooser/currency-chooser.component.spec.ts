import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyChooserComponent } from './currency-chooser.component';

describe('CurrencyChooserComponent', () => {
  let component: CurrencyChooserComponent;
  let fixture: ComponentFixture<CurrencyChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
