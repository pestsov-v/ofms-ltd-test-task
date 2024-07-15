import type { ILoggerService, ITaskService } from "../services";

export interface IFunctionalityAgent {
  readonly logger: NFunctionalityAgent.Logger;
  readonly scheduler: NFunctionalityAgent.Scheduler;
}

export namespace NFunctionalityAgent {
  export type Logger = {
    api: ILoggerService["api"];
    error: ILoggerService["error"];
  };

  export type Scheduler = {
    on: ITaskService["on"];
    once: ITaskService["once"];
    off: ITaskService["off"];
    removeListener: ITaskService["removeListener"];
    get: ITaskService["get"];
    set: ITaskService["set"];
    delete: ITaskService["delete"];
  };
}
