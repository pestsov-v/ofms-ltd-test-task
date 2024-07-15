import { injectable, inject } from "~packages";
import { Tokens } from "~tokens";
import { container } from "~container";

import type { Mongoose } from "~packages-types";
import type {
  IFunctionalityAgent,
  ILoggerService,
  IMongoConnector,
  IMongoTunnel,
  NMongoTunnel,
  NSchemaService,
} from "~core-types";

@injectable()
export class MongoTunnel implements IMongoTunnel {
  constructor(
    @inject(Tokens.MongoConnector)
    private readonly _mongoConnector: IMongoConnector,
    @inject(Tokens.LoggerService)
    private readonly _loggerService: ILoggerService
  ) {}

  public setModels(fnModels: NMongoTunnel.SchemaInfo<unknown>[]): void {
    const { connection } = this._mongoConnector;

    fnModels.forEach((fn) => {
      const agents: NSchemaService.Agents = {
        fnAgent: container.get<IFunctionalityAgent>(Tokens.FunctionalityAgent),
      };

      const model = fn.getSchema(agents);

      const schema = model.options
        ? new connection.Schema(model.definition, model.options)
        : new connection.Schema(model.definition);

      connection.model(fn.model, schema);
    });
  }

  private get _models(): Mongoose.Models {
    const models = this._mongoConnector.connection.models;
    if (!models) {
      throw new Error('"Models not initialize"');
    }

    return models;
  }

  public async create<TRawDocType>(
    model: string,
    docs: Mongoose.Docs<TRawDocType>,
    options?: Mongoose.SaveOptions
  ): Promise<Mongoose.AnyKeys<TRawDocType>> {
    try {
      return options
        ? await this._models[model].create<TRawDocType>(docs, options)
        : await this._models[model].create<TRawDocType>(docs);
    } catch (e) {
      this._loggerService.catch(e);
      throw e;
    }
  }
}
