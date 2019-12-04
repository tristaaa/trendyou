import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapdonutComponent } from './mapdonut.component';

describe('MapdonutComponent', () => {
  let component: MapdonutComponent;
  let fixture: ComponentFixture<MapdonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapdonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapdonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
