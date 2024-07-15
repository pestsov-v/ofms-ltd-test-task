import { injectable } from "~packages";

import type { IAbstractConnector, ILoggerService } from "~core-types";

@injectable()
export abstract class AbstractConnector implements IAbstractConnector {
  protected abstract _CONNECTOR_NAME: string;
  protected abstract _loggerService: ILoggerService;

  protected abstract init(): Promise<void>;
  protected abstract destroy(): Promise<void>;

  public async start(): Promise<void> {
    try {
      await this.init();
    } catch (e) {
      this._loggerService.catch(e);
      throw e;
    }

    const msg = this._CONNECTOR_NAME + " connector has started.";

    if (this._loggerService) {
      this._loggerService.system(msg);
    } else {
      console.info(msg);
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.destroy();
    } catch (e) {
      this._loggerService.catch(e);
      throw e;
    }

    const msg = this._CONNECTOR_NAME + " connector has stopped.";
    if (this._loggerService) {
      this._loggerService.system(msg);
    } else {
      console.info(msg);
    }
  }
}
