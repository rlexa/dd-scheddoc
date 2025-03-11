import {dateToEndOfMonthDatePart, dateToStartOfMonthDatePart} from './util-date';

describe(`util-date`, () => {
  describe(`dateToEndOfMonthDatePart`, () => {
    it('transforms', () => expect(dateToEndOfMonthDatePart('2000-01-10T12:00:00')).toBe('2000-01-31'));
  });

  describe(`dateToStartOfMonthDatePart`, () => {
    it('transforms', () => expect(dateToStartOfMonthDatePart('2000-01-10T12:00:00')).toBe('2000-01-01'));
  });
});
