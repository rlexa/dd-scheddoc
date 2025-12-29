import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {ObjectFormService} from './object-form.service';

const data = {
  key: 'value',
};

describe('ObjectFormService', () => {
  let instance: ObjectFormService<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ObjectFormService]});
    instance = TestBed.inject(ObjectFormService);
  });

  it(`creates instance`, () => expect(instance).toBeTruthy());
  it(`has no changes`, async () => expect(await firstValueFrom(instance.hasChanges$)).toBe(false));
  it(`can not reset`, async () => expect(await firstValueFrom(instance.canReset$)).toBe(false));
  it(`is not valid`, async () => expect(await firstValueFrom(instance.valid$)).toBe(false));
  it(`has no value`, async () => expect(await firstValueFrom(instance.value$)).toBe(undefined));

  describe(`with source`, () => {
    beforeEach(() => {
      instance.setSource(data);
    });

    it(`has no changes`, async () => expect(await firstValueFrom(instance.hasChanges$)).toBe(false));
    it(`can not reset`, async () => expect(await firstValueFrom(instance.canReset$)).toBe(false));
    it(`is valid`, async () => expect(await firstValueFrom(instance.valid$)).toBe(true));
    it(`has value`, async () => expect(await firstValueFrom(instance.value$)).toEqual(data));
  });
});
