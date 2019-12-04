import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BesttimeComponent } from './besttime.component';

describe('BesttimeComponent', () => {
  let component: BesttimeComponent;
  let fixture: ComponentFixture<BesttimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BesttimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BesttimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
