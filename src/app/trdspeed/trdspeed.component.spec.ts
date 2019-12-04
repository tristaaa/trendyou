import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrdspeedComponent } from './trdspeed.component';

describe('TrdspeedComponent', () => {
  let component: TrdspeedComponent;
  let fixture: ComponentFixture<TrdspeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrdspeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrdspeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
