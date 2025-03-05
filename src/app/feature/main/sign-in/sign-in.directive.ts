import {Directive, inject, OnDestroy, OnInit} from '@angular/core';
import {Auth, GoogleAuthProvider, signInWithPopup, Unsubscribe} from '@angular/fire/auth';
import {DiUser} from 'src/app/data/active';

@Directive({selector: '[appSignIn]'})
export class SignInDirective implements OnDestroy, OnInit {
  private readonly auth = inject(Auth);
  protected readonly user$ = inject(DiUser);

  private unsub?: Unsubscribe;

  ngOnDestroy() {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }

  ngOnInit() {
    this.unsub = this.auth.onAuthStateChanged((user) => {
      this.user$.next(user ?? undefined);
      if (!user) {
        this.login();
      }
    });
  }

  private async login() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Google sign-In error', error);
    }
  }
}
