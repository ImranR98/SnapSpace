import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithMeImagesComponent } from './shared-with-me-images.component';

describe('SharedWithMeImagesComponent', () => {
  let component: SharedWithMeImagesComponent;
  let fixture: ComponentFixture<SharedWithMeImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedWithMeImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedWithMeImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
