/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { ThreeService } from './three.service';

describe('Three Service', () => {
  beforeEachProviders(() => [ThreeService]);

  it('should ...',
      inject([ThreeService], (service: ThreeService) => {
    expect(service).toBeTruthy();
  }));
});
