/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { ThreeComponent } from './three.component';

describe('Component: Three', () => {
  it('should create an instance', () => {
    let component = new ThreeComponent();
    expect(component).toBeTruthy();
  });
});
