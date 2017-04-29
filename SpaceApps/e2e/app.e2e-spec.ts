import { SpaceAppsPage } from './app.po';

describe('space-apps App', () => {
  let page: SpaceAppsPage;

  beforeEach(() => {
    page = new SpaceAppsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
