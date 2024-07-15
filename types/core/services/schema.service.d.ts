import type { IAbstractService } from "./abstract.service";
import type { NMongoTunnel } from "../tunnels";
import type { IFunctionalityAgent } from "../agents";
import type { HttpMethod, Version } from "../common";
import type { NHttpService } from "./http.service";

export interface ISchemaService extends IAbstractService {
  readonly schema: NSchemaService.BusinessScheme;
  readonly mongoModels: NMongoTunnel.SchemaInfo<unknown>[];
}

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
