import { injectable, inject, mongoose } from "~packages";
import { AbstractConnector } from "./abstract.connector";
import { Tokens } from "~tokens";

import type { Mongoose } from "~packages-types";
import {
  IConfigurationService,
  IFunctionalityAgent,
  ILoggerService,
  IMongoConnector,
  ISchemaService,
  NSchemaService,
} from "~core-types";
import { container } from "~container";

@injectable()
export class MongoConnector
  extends AbstractConnector
  implements IMongoConnector
{
  protected _CONNECTOR_NAME = MongoConnector.name;
  private _connection: Mongoose.Mongoose | undefined;

  constructor(
    @inject(Tokens.ConfigurationService)
    private readonly _confService: IConfigurationService,
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService,
    @inject(Tokens.SchemaService)
    private readonly _schemaService: ISchemaService
  ) {
    super();
  }

  protected async init(): Promise<void> {
    const mongo = {
      enable: true,
      protocol: "mongodb",
      host: "0.0.0.0",
      port: 27017,
      auth: {
        username: "",
        password: "",
      },
      database: "default",
    };

    if (!mongo.enable) {
      this._loggerService.system(`MongoConnector not enable.`);
    }

    const url = `${mongo.protocol}://${mongo.host}:${mongo.port}`;

    const options: Mongoose.ConnectionOptions = {
      dbName: mongo.database,
      auth: {
        username: mongo.auth.username,
        password: mongo.auth.password,
      },
    };

    await mongoose
      .connect(url, options)
      .then((conn) => {
        this._loggerService.system(`Mongodb client connect to ${url}`);
        this._connection = conn;
      })
      .catch((e) => {
        this._loggerService.catch(e);
        throw e;
      });

    try {
      this._setModels();
    } catch (e) {
      this._loggerService.catch(e);
    }
  }

  private _setModels() {
    this._schemaService.mongoModels.forEach((fn) => {
      const agents: NSchemaService.Agents = {
        fnAgent: container.get<IFunctionalityAgent>(Tokens.FunctionalityAgent),
      };

      const model = fn.getSchema(agents);

      const schema = model.options
        ? new this.connection.Schema(model.definition, model.options)
        : new this.connection.Schema(model.definition);

      this.connection.model(fn.model, schema);
    });
  }

  protected async destroy(): Promise<void> {
    if (!this._connection) return;

    try {
      await this._connection.disconnect();
    } catch (e) {
      this._loggerService.catch(e);
    }

    this._loggerService.system(`${MongoConnector.name} has been stopped.`);
    this._connection = undefined;
  }

  public get connection(): Mongoose.Mongoose {
    if (!this._connection) {
      throw new Error("MongoDB connection not initialize.");
    }

    return this._connection;
  }
}
