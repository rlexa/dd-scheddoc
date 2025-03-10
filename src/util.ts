import {MonoTypeOperatorFunction, shareReplay} from 'rxjs';

export const jsonEqual = <T>(left: T, right: T): boolean => left === right || JSON.stringify(left) === JSON.stringify(right);

export const notNullUndefined = <T>(val: T | null | undefined): val is T => val !== null && val !== undefined;

/** First subscribes, others share. */
export function fanOut<T>(): MonoTypeOperatorFunction<T> {
  return shareReplay<T>({refCount: true, bufferSize: 1});
}

export const strPadStart = (padWith: string) => (max: number) => (val: string | null) => val?.padStart(max, padWith) ?? null;
export const strPadStartWithZero = strPadStart('0');
export const strPadStartWithZero2 = strPadStartWithZero(2);
export const strPadStartWithZero4 = strPadStartWithZero(4);
