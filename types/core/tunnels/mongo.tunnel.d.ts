import type { Mongoose } from "../../packages";
import type { NSchemaService } from "../services";

export interface IMongoTunnel {
  setModels(fnModels: NMongoTunnel.SchemaInfo<unknown>[]);
  create<TRawDocType>(
    model: string,
    docs: Mongoose.Docs<TRawDocType>,
    options?: Mongoose.SaveOptions
  ): Promise<Mongoose.AnyKeys<TRawDocType>>;
}

export namespace NMongoTunnel {
  export type Schema<T> = {
    definition: Mongoose.SchemaDefinition<T>;
    options?: Mongoose.SchemaOptions;
  };

  export type SchemaFn<T = any> = (agents: NSchemaService.Agents) => Schema<T>;

  export type SchemaInfo<T = any> = {
    model: string;
    getSchema: SchemaFn<T>;
  };
}
