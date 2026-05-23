import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTimeline } from './player-timeline';

describe('PlayerTimeline', () => {
  let component: PlayerTimeline;
  let fixture: ComponentFixture<PlayerTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
