import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pocha } from './pocha';

describe('Pocha', () => {
  let component: Pocha;
  let fixture: ComponentFixture<Pocha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pocha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pocha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
