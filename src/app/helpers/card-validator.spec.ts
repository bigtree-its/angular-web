import { TestBed } from '@angular/core/testing';
import { CardValidator } from './card-validator';

describe('CardValidator', () => {
  let service: CardValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CardValidator] });
    service = TestBed.inject(CardValidator);
  });

  it('Can test the CardType for the given card number', () => {
    expect(service).toBeTruthy();
    expect(service.cardType("5355220548174790")).toEqual("mastercard");
    expect(service.cardType("5355 2205 4817 4790")).toEqual("mastercard");
  });
});
