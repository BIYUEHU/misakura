import Controller from './controller';
import Context from 'fluoro';
import Config from './config';
import DialogPage from '../pages/dialogPage';
import HomePage from '../pages/homePage';

declare module 'fluoro' {
  interface Context {
    config: Config['config'];
    /* Pages */
    dialog: DialogPage;
    home: HomePage;
  }

  interface EventsMapping {
  nextdialog(): void;
  resize(): void;
  initialized(): void;
}
}

export class Core extends Context {
  public constructor(config?: ConstructorParameters<typeof Config>[0]) {
    super();
    this.provide('config', new Config(config));
    this.mixin('config', ['config']);
    this.provide('controller', new Controller(this));
    this.mixin('controller', ['app', 'ctn', 'checkout', 'view', 'height', 'width', 'calcX', 'calcY']);
    /* Pages */
    this.provide('dialog', new DialogPage(this));
    this.inject('dialog');
    this.provide('home', new HomePage(this));
    this.inject('home');
  }
}

export default Core;
