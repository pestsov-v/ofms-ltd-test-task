import { injectable, inject } from "~packages";
import { Tokens } from "~tokens";
import { Helpers } from "~utils";

import type {
  HttpMethod,
  ILoggerService,
  ISchemaLoader,
  NSchemaLoader,
  NSchemaService,
} from "~core-types";

@injectable()
export class SchemaLoader implements ISchemaLoader {
  private _SCHEME: NSchemaService.BusinessScheme | undefined;
  private _DOMAINS: NSchemaService.Service | undefined;

  constructor(
    @inject(Tokens.LoggerService)
    private readonly _loggerService: ILoggerService
  ) {}

  public get services(): NSchemaService.BusinessScheme {
    if (!this._SCHEME) {
      throw new Error("Services map not initialize");
    }

    return this._SCHEME;
  }

  private get _domains(): NSchemaService.Service {
    if (!this._DOMAINS) {
      throw new Error("Domains map not initialize");
    }

    return this._DOMAINS;
  }

  public init() {
    this._SCHEME = new Map<string, NSchemaService.Service>();
    this._DOMAINS = new Map<string, NSchemaService.Domain>();
  }

  public destroy() {
    this._DOMAINS = undefined;
    this._SCHEME = undefined;
  }

  loadStructures(services: NSchemaLoader.ServiceStructure[]): void {
    services.forEach((service): void => {
      service.domains.forEach((domain): void => {
        const name = domain.domain;
        const { documents } = domain;

        this._setDomain(name);
        if (documents.router) {
          this._setRoute(service.service, name, documents.router);
        }

        this._applyDomainToService(service.service, domain.domain);
      });
    });
  }

  private _setRoute(
    service: string,
    domain: string,
    structure: NSchemaLoader.RouterStructure
  ): void {
    const storage = this._domains.get(domain);
    if (!storage) {
      this._setDomain(domain);
      this._setRoute(service, domain, structure);
      return;
    }

    for (const path in structure) {
      if (path.includes("/")) {
        throw new Error(
          `Not supported dots '.'. Please use slag string path for '${path}' path in '${domain}' domain in '${service}' service.`
        );
      }

      if (path.includes(".")) {
        throw new Error(
          `Not supported dots '.'. Please use slag string path for '${path}' path in '${domain}' domain in '${service}' service.`
        );
      }

      const methods = structure[path];
      for (const m in methods) {
        const method = m as HttpMethod;

        const route = methods[method];
        if (route) {
          const version = route.version ?? "v1";

          const name = Helpers.getRouteUniqueName(method, version, path);

          if (storage.routes.has(name)) {
            throw new Error(
              `Route '${name}' has been exists in '${domain}' domain in '${service}' service.`
            );
          }

          this._loggerService.system(
            `Route '${name}' in '${domain}' domain in '${service}' service has been registration.`
          );

          storage.routes.set(name, {
            path: path,
            method: method,
            handler: route.handler,
            params: route.params ?? null,
            version: version,
          });
        }
      }
    }
  }

  private _applyDomainToService(service: string, domain: string): void {
    const sStorage = this.services.get(service);
    if (!sStorage) {
      this.services.set(service, new Map<string, NSchemaService.Domain>());
      this._applyDomainToService(service, domain);
      return;
    }

    const dStorage = this._domains.get(domain);
    if (!dStorage) {
      throw new Error(`Domain ${domain} not found`);
    }

    sStorage.set(domain, dStorage);
  }

  private _setDomain(domain: string): void {
    this._domains.set(domain, {
      routes: new Map<string, NSchemaService.Route>(),
    });
  }
}
