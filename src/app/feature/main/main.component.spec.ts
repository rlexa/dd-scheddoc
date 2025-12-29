import {Auth, User} from '@angular/fire/auth';
import {MockBuilder, MockedComponentFixture, MockRender} from 'ng-mocks';
import {of} from 'rxjs';
import {DiIsAdmin} from 'src/app/data';
import {DiUser} from 'src/app/data/active';
import {MainComponent} from './main.component';

describe('MainComponent', () => {
  let fixture: MockedComponentFixture<MainComponent>;

  beforeEach(() =>
    MockBuilder(MainComponent)
      .provide({provide: Auth, useValue: {signOut: vi.fn()}})
      .provide({provide: DiIsAdmin, useValue: of(true)})
      .provide({provide: DiUser, useValue: of<Partial<User>>({displayName: 'displayName'})}),
  );

  beforeEach(() => {
    fixture = MockRender(MainComponent);
    fixture.detectChanges();
  });

  it('has instance', () => expect(fixture.componentInstance).toBeTruthy());

  it('renders', () => expect(fixture).toMatchSnapshot());
});
