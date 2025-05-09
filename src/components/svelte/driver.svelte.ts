import { getContext, setContext } from 'svelte';
export class Driver {
  progress = 0;

  constructor() {}
}

export function setDriver(driver: Driver) {
  setContext('driver', driver);
}
export function getDrvier() {
  return getContext('drvier') as Driver;
}
