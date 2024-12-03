import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPromocionPage } from './agregar-promocion.page';

describe('AgregarPromocionPage', () => {
  let component: AgregarPromocionPage;
  let fixture: ComponentFixture<AgregarPromocionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPromocionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
