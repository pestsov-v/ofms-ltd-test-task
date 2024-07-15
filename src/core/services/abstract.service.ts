import { injectable } from "~packages";

import type { IAbstractService, ILoggerService } from "~core-types";

@injectable()
export abstract class AbstractService implements IAbstractService {
  protected abstract _SERVICE_NAME: string;
  protected abstract _loggerService: ILoggerService | undefined;

  protected abstract init(): Promise<boolean>;
  protected abstract destroy(): Promise<void>;

  public async start(): Promise<void> {
    if (await this.init()) {
      const msg = this._SERVICE_NAME + " service has started.";

      if (this._loggerService) {
        this._loggerService.system(msg);
      } else {
        console.info(msg);
      }
    } else {
      const msg = this._SERVICE_NAME + " service not enabled.";

      if (this._loggerService) {
        this._loggerService.system(msg);
      } else {
        console.info(msg);
      }
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.destroy();
    } catch (e) {
      if (this._loggerService) {
        this._loggerService.catch(e);
      } else {
        console.error(e);
      }
    }
  }
}
