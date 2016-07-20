import { DrewAngular2FirebasePage } from './app.po';

describe('drew-angular2-firebase App', function() {
  let page: DrewAngular2FirebasePage;

  beforeEach(() => {
    page = new DrewAngular2FirebasePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
