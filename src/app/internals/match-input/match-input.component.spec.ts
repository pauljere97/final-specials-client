import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchInputComponent } from './match-input.component';

describe('MatchInputComponent', () => {
  let component: MatchInputComponent;
  let fixture: ComponentFixture<MatchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
