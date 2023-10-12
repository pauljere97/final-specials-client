import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMatchComponent } from './show-match.component';

describe('ShowMatchComponent', () => {
  let component: ShowMatchComponent;
  let fixture: ComponentFixture<ShowMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
