import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LolliComponent } from './lolli.component';

describe('LolliComponent', () => {
  let component: LolliComponent;
  let fixture: ComponentFixture<LolliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LolliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LolliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
