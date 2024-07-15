import { inject, injectable } from "~packages";
import { Tokens } from "~tokens";
import { AbstractService } from "./abstract.service";

import type { ILoggerService, ITaskService } from "~core-types";

@injectable()
export class TaskService extends AbstractService implements ITaskService {
  protected _SERVICE_NAME = TaskService.name;

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
