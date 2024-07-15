import { inject, injectable } from "~packages";
import { Tokens } from "~tokens";

import type {
  ILoggerService,
  IFunctionalityAgent,
  NFunctionalityAgent,
} from "~core-types";

@injectable()
export class FunctionalityAgent implements IFunctionalityAgent {
  constructor(
    @inject(Tokens.LoggerService)
    private readonly _loggerService: ILoggerService
  ) {}

  public get logger(): NFunctionalityAgent.Logger {
    return {
      api: (msg) => {
        return this._loggerService.api(msg);
      },
      error: (msg) => {
        return this._loggerService.error(msg);
      },
    };
  }
}
