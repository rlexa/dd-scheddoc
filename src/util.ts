import {MonoTypeOperatorFunction, shareReplay} from 'rxjs';

export const jsonEqual = <T>(left: T, right: T): boolean => left === right || JSON.stringify(left) === JSON.stringify(right);

export const notNullUndefined = <T>(val: T | null | undefined): val is T => val !== null && val !== undefined;

/** First subscribes, others share. */
export function fanOut<T>(): MonoTypeOperatorFunction<T> {
  return shareReplay<T>({refCount: true, bufferSize: 1});
}
