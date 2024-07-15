import { IAbstractService } from "./abstract.service";

export interface ISchemaService extends IAbstractService {}

export namespace NSchemaService {
  // common
  export type Events = "schema-reload";

  export type Agents = {
    fnAgent: IFunctionalityAgent;
  };

  // route details
  export type RouteParam = {
    name: string;
    scope: "required" | "optional";
  };

  export type Route = {
    path: string;
    method: HttpMethod;
    version: Version;
    handler: NHttpService.ApiHandler;
    params: RouteParam[] | null;
  };

  // business schema structures
  export type Domain = {
    routes: Map<string, Route>;
    mongo?: {
      name: string;
      schema: NMongoTunnel.SchemaFn;
    };
  };
  export type Service = Map<string, Domain>;
  export type BusinessScheme = Map<string, Service>;
}
