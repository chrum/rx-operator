import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonalPlayerComponent } from './tonal-player.component';

describe('TonalPlayerComponent', () => {
  let component: TonalPlayerComponent;
  let fixture: ComponentFixture<TonalPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TonalPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TonalPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
