import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicfeaComponent } from './basicfea.component';

describe('BasicfeaComponent', () => {
  let component: BasicfeaComponent;
  let fixture: ComponentFixture<BasicfeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicfeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicfeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
