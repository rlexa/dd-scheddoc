import {MockBuilder, MockedComponentFixture, MockRender} from 'ng-mocks';
import {MainComponent} from './main.component';

describe('MainComponent', () => {
  let fixture: MockedComponentFixture<MainComponent>;

  beforeEach(() => MockBuilder(MainComponent));

  beforeEach(() => {
    fixture = MockRender(MainComponent);
    fixture.detectChanges();
  });

  it('has instance', () => expect(fixture.componentInstance).toBeTruthy());

  it('renders', () => expect(fixture).toMatchSnapshot());
});
