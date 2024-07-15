import { injectable, inject, events } from "~packages";
import { Tokens } from "~tokens";
import { SCHEMA_SERVICES } from "~vendor";
import { AbstractService } from "./abstract.service";

import { Events, RabbitMQ } from "~packages-types";
import {
  ILoggerService,
  ISchemaService,
  NSchemaService,
  ISchemaLoader,
  NSchemaLoader,
  NMongoTunnel,
  NRabbitMQConnector,
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

  public get mongoModels(): NMongoTunnel.SchemaInfo[] {
    const models: NMongoTunnel.SchemaInfo[] = [];

    this.schema.forEach((service) => {
      service.forEach((domain) => {
        if (domain.mongo) {
          models.push({
            model: domain.mongo.name,
            getSchema: domain.mongo.schema,
          });
        }
      });
    });

    return models;
  }

  public get brokerMessages(): NSchemaService.BrokerTopics {
    const queues: Array<Omit<NRabbitMQConnector.QueueContract, "channel">> = [];

    const exchange: Array<
      Omit<NRabbitMQConnector.ExchangeContract, "channel">
    > = [];

    this.schema.forEach((sStorage, sName) => {
      sStorage.forEach((sDomain, dName) => {
        sDomain.broker.forEach((topic, queue) => {
          switch (topic.type) {
            case "queue":
              queues.push({
                queue: queue,
                domain: dName,
                service: sName,
                topic: topic,
              });
              break;
            case "exchange":
              exchange.push({
                topic: topic,
                queue: queue,
              });
              break;
          }
        });
      });
    });

    return { queues, exchange };
  }

  private _clearSchema() {
    this._schemaLoader.destroy();
  }
}
