import { injectable, inject, events } from "~packages";
import { Tokens } from "~tokens";
import { SCHEMA_SERVICES } from "~vendor";
import { AbstractService } from "./abstract.service";

import type { Events } from "~packages-types";
import {
  ILoggerService,
  ISchemaService,
  NSchemaService,
  ISchemaLoader,
  NSchemaLoader,
} from "~core-types";

@injectable()
export class SchemaService extends AbstractService implements ISchemaService {
  private _emitter: Events.EventEmitter;
  private _SCHEMA: NSchemaService.BusinessScheme | undefined;

  protected _SERVICE_NAME = SchemaService.name;

  constructor(
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService,
    @inject(Tokens.SchemaLoader)
    private readonly _schemaLoader: ISchemaLoader
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
        this._clearSchema();
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

  private get _schemaServices(): NSchemaLoader.ServiceStructure[] {
    if (!SCHEMA_SERVICES || SCHEMA_SERVICES.length === 0) {
      throw new Error("Schema services array is empty.");
    }

    return SCHEMA_SERVICES;
  }

  protected async destroy(): Promise<void> {
    this._emitter.removeAllListeners();
    this._clearSchema();
  }

  private async _runWorker(): Promise<void> {
    try {
      this._schemaLoader.init();
      this._schemaLoader.loadStructures(this._schemaServices);

      this._SCHEMA = this._schemaLoader.services;
    } catch (e) {
      this._loggerService.catch(e);
      throw e;
    }
  }

  private _clearSchema() {
    this._schemaLoader.destroy();
  }
}
