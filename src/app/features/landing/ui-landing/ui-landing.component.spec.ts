import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLandingComponent } from './ui-landing.component';

describe('UiLandingComponent', () => {
  let component: UiLandingComponent;
  let fixture: ComponentFixture<UiLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
