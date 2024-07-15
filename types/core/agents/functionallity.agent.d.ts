import type { ILoggerService } from "../services";

export interface IFunctionalityAgent {
  readonly logger: NFunctionalityAgent.Logger;
}

export namespace NFunctionalityAgent {
  export type Logger = {
    api: ILoggerService["api"];
    error: ILoggerService["error"];
  };
}
