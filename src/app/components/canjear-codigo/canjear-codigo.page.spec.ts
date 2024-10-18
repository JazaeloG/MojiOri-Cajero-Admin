import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanjearCodigoPage } from './canjear-codigo.page';

describe('CanjearCodigoPage', () => {
  let component: CanjearCodigoPage;
  let fixture: ComponentFixture<CanjearCodigoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CanjearCodigoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
