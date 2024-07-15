import { injectable, inject } from "~packages";
import { AbstractService } from "./abstract.service";
import { Tokens } from "~tokens";

import type { IHttpService, ILoggerService } from "~core-types";

@injectable()
export class HttpService extends AbstractService implements IHttpService {
  protected _SERVICE_NAME = HttpService.name;

  constructor(
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService
  ) {
    super();
  }

  protected async init(): Promise<boolean> {
    return true;
  }

  protected async destroy(): Promise<void> {}
}
