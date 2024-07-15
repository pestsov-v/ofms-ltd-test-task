import type { HttpMethod, Version } from "../common";
import type { NHttpService, NSchemaService } from "../services";
import type { NMongoTunnel } from "../tunnels";

export interface ISchemaLoader {
  readonly services: NSchemeService.BusinessScheme;

  readonly init(): void;
  readonly destroy(): void;
  readonly loadStructures(services: NSchemaLoader.ServiceStructure[]): void;
}

export namespace NSchemaLoader {
  // mongodb schema

  export type MongoSchemaStructure<T> = (
    agents: NSchemeService.Agents
  ) => NMongoTunnel.Schema<T>;

  // route details
  export type RouterStructure<R extends string = string> = {
    [key in R]: {
      [key in HttpMethod]?: {
        version?: Version;
        params?: NSchemaService.RouteParam[];
        handler: NHttpService.ApiHandler;
      };
    };
  };

  // business scheme structures
  export type DocumentsStructure = {
    router?: RouterStructure;
  };

  export type DomainStructure<D extends string = string> = {
    domain: D;
    documents: DocumentsStructure;
  };

  export type ServiceStructure<S extends string = string> = {
    service: S;
    domains: DomainStructure[];
  };
}
