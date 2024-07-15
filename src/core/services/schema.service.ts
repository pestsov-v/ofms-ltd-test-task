import { injectable, inject, events } from "~packages";
import { Tokens } from "~tokens";
import { AbstractService } from "./abstract.service";

import type { Events } from "~packages-types";
import type {
  ILoggerService,
  ISchemaService,
  NSchemaService,
} from "~core-types";

@injectable()
export class SchemaService extends AbstractService implements ISchemaService {
  private _emitter: Events.EventEmitter;
  private _SCHEMA: NSchemaService.BusinessScheme | undefined;

  protected _SERVICE_NAME = SchemaService.name;

  constructor(
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService
  ) {
    super();

    this._emitter = new events.EventEmitter();
  }

  private _on(
    event: NSchemaService.Events,
    fn: () => void | Promise<void>
  ): void {
    this._emitter.on(event, fn);
  }

  public get schema(): NSchemaService.BusinessScheme {
    if (!this._SCHEMA) {
      throw new Error("Business schema not initialize.");
    }

    return this._SCHEMA;
  }

  protected async init(): Promise<boolean> {
    // TODO: implement cli manager service with reload functionality
    // TODO: implement context service with async_hooks and get schema snapshot from context service
    this._on("schema-reload", async () => {
      try {
        await this._runWorker();
        this._loggerService.system("Business scheme reload");
      } catch (e) {
        this._loggerService.catch(e);
      }
    });

    try {
      await this._runWorker();
      this._loggerService.system("Business scheme load");
    } catch (e) {
      this._loggerService.catch(e);
      return false;
    }

    return true;
  }

  protected async destroy(): Promise<void> {
    this._emitter.removeAllListeners();
  }

  private async _runWorker(): Promise<void> {
    try {
      // resolve business scheme
    } catch (e) {
      this._loggerService.catch(e);
      throw e;
    }
  }
}
