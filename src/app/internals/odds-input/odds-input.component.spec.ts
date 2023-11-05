import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OddsInputComponent } from './odds-input.component';

describe('OddsInputComponent', () => {
  let component: OddsInputComponent;
  let fixture: ComponentFixture<OddsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OddsInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OddsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
