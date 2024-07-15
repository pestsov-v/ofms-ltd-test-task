import { inject, injectable } from "~packages";
import { Tokens } from "~tokens";
import { AbstractService } from "./abstract.service";

import type { ILoggerService, ISchemaService } from "~core-types";

@injectable()
export class SchemaService extends AbstractService implements ISchemaService {
  protected _SERVICE_NAME = SchemaService.name;

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
