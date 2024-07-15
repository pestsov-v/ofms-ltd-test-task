import { injectable, inject } from "~packages";
import { Tokens } from "~tokens";
import { AbstractConnector } from "./abstract.connector";

import type {
  IAbstractService,
  IComputeConnector,
  ILoggerService,
} from "~core-types";

@injectable()
export class ComputeConnector
  extends AbstractConnector
  implements IComputeConnector
{
  protected _CONNECTOR_NAME = ComputeConnector.name;

  constructor(
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService,

    @inject(Tokens.ConfigurationService)
    private readonly _confService: IAbstractService,
    @inject(Tokens.SchemaService)
    private readonly _schemaService: IAbstractService,
    @inject(Tokens.HttpService)
    private readonly _httpService: IAbstractService,
    @inject(Tokens.TaskService)
    private readonly _taskService: IAbstractService
  ) {
    super();
  }

  protected async init(): Promise<void> {
    try {
      await this._confService.start();
      await this._loggerService.start();
      await this._schemaService.start();
      await this._httpService.start();
      await this._taskService.start();
    } catch (e) {
      // TODO: implement error provider with signal generate methods
      throw e;
    }
  }

  protected async destroy(): Promise<void> {
    try {
      await this._taskService.stop();
      await this._httpService.stop();
      await this._schemaService.stop();
      await this._loggerService.stop();
      await this._confService.stop();
    } catch (e) {
      // TODO: implement error provider with signal generate methods
      throw e;
    }
  }
}
