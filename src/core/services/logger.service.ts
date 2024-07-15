import { injectable } from "inversify";
import { AbstractService } from "./abstract.service";

import type { ILoggerService } from "~core-types";

@injectable()
export class LoggerService extends AbstractService implements ILoggerService {
  protected _SERVICE_NAME = LoggerService.name;
  protected _loggerService: ILoggerService = this;

  constructor() {
    super();
  }

  protected async init() {
    // implement initialization of logger
    // transport and logger container
    // for example with winston or another.

    // if this initialization is successful - return true or false

    return true;
  }

  protected async destroy() {
    // implement destroy logical of logger
    // transport and logger container
  }

  public catch(e: unknown): void {
    console.error(e);
  }

  public error(msg: string): void {
    console.error(msg);
  }
  public warn(msg: string): void {
    console.warn(msg);
  }
  public api(msg: string): void {
    console.log(msg);
  }
  public system(msg: string): void {
    console.info(msg);
  }
}
