import {Auth, User} from '@angular/fire/auth';
import {MockBuilder, MockedComponentFixture, MockRender} from 'ng-mocks';
import {of} from 'rxjs';
import {DiUser} from 'src/app/data/active';
import {Mock} from 'ts-mockery';
import {MainComponent} from './main.component';

describe('MainComponent', () => {
  let fixture: MockedComponentFixture<MainComponent>;

  beforeEach(() =>
    MockBuilder(MainComponent)
      .provide({provide: Auth, useValue: Mock.all<Auth>()})
      .provide({provide: DiUser, useValue: of<Partial<User>>({displayName: 'displayName', photoURL: 'photoURL'})}),
  );

  beforeEach(() => {
    fixture = MockRender(MainComponent);
    fixture.detectChanges();
  });

  it('has instance', () => expect(fixture.componentInstance).toBeTruthy());

  it('renders', () => expect(fixture).toMatchSnapshot());
});
