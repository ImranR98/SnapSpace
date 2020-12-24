import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicImagesComponent } from './public-images.component';

describe('PublicImagesComponent', () => {
  let component: PublicImagesComponent;
  let fixture: ComponentFixture<PublicImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
