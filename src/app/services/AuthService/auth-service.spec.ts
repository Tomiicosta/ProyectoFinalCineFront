import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service';

describe('AuthService', () => {
  const createToken = (roles: string[], expiresAt: number): string => {
    const encode = (value: object) =>
      btoa(JSON.stringify(value))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ roles, exp: expiresAt })}.signature`;
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts as a guest when there is no token', () => {
    const service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.isAdmin()).toBeFalse();
  });

  it('removes an expired admin token before exposing the session', () => {
    localStorage.setItem(
      'token',
      createToken(['ADMIN'], Math.floor(Date.now() / 1000) - 60)
    );

    const service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.isAdmin()).toBeFalse();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('keeps a valid client session without exposing admin navigation', () => {
    localStorage.setItem(
      'token',
      createToken(['CLIENTE'], Math.floor(Date.now() / 1000) + 3600)
    );

    const service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.isAdmin()).toBeFalse();
  });

  it('exposes admin navigation only for a valid admin token', () => {
    localStorage.setItem(
      'token',
      createToken(['ADMIN'], Math.floor(Date.now() / 1000) + 3600)
    );

    const service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.isAdmin()).toBeTrue();
  });
});
