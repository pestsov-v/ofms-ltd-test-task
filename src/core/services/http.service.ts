import { injectable, inject, fastify } from "~packages";
import { Tokens } from "~tokens";
import { Helpers } from "~utils";
import { AbstractService } from "./abstract.service";

import type { Fastify } from "~packages-types";
import {
  HttpMethod,
  IConfigurationService,
  IFunctionalityAgent,
  IHttpService,
  ILoggerService,
  ISchemaService,
  NHttpService,
  NSchemaService,
} from "~core-types";
import { container } from "~container";

@injectable()
export class HttpService extends AbstractService implements IHttpService {
  protected _SERVICE_NAME = HttpService.name;
  protected _instance: Fastify.Instance | undefined;
  private readonly _httpMethods: HttpMethod[];

  constructor(
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService,
    @inject(Tokens.ConfigurationService)
    protected readonly _confService: IConfigurationService,
    @inject(Tokens.SchemaService)
    protected readonly _schemaService: ISchemaService
  ) {
    super();

    this._httpMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
  }

  public async init(): Promise<boolean> {
    const actionParams = "/:service/:domain/:version/:action";

    const http = {
      protocol: "http",
      host: "0.0.0.0",
      port: 11000,
      urls: {
        api: "/v1/call/api",
      },
    };

    this._instance = fastify.fastify({
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true,
    });
    this._instance.route({
      method: this._httpMethods,
      handler: this._callApi,
      url: http.urls.api + actionParams,
    });
    this._instance.route({
      method: this._httpMethods,
      handler: this._callApi,
      url: http.urls.api + `${actionParams}/*`,
    });

    try {
      await this._instance.listen({ host: http.host, port: http.port }, () => {
        this._loggerService.system(
          `Http server listening on ${http.protocol}://${http.host}:${http.port}`
        );
      });
    } catch (e) {
      console.error(e);
    }

    return true;
  }

  public async destroy(): Promise<void> {
    if (this._instance) {
      await this._instance.close();
      this._instance = undefined;
    }

    this._loggerService.system(`Http server has been stopped.`);
  }

  protected _callApi = async (
    req: Fastify.Request,
    res: Fastify.Response
  ): Promise<void> => {
    const domain = this._getDomainStorage(
      req.params.service,
      req.params.domain
    );

    if (domain.type === "fail") {
      return res.status(400).send(domain.message);
    }

    if (!domain.domain.routes) {
      return res.status(400).send({
        data: {
          message: "Domain does not have any routes",
        },
      });
    }

    const act = Helpers.getRouteUniqueName(
      req.method,
      req.params.version,
      req.params.action
    );

    const action = domain.domain.routes.get(act);
    if (!action) {
      return res.status(404).send({
        data: {
          message: "Action not found",
        },
      });
    }

    const params = this._getParams(req.params, action.params, res);

    try {
      const result = await action.handler(
        {
          method: req.method,
          body: req.body,
          params: params,
          path: req.routeOptions.url,
          url: req.url,
        },
        {
          fnAgent: container.get<IFunctionalityAgent>(
            Tokens.FunctionalityAgent
          ),
        }
      );

      if (!result) {
        return res.status(204).send();
      }

      if (result.headers) res.headers(result.headers);

      return res.status(result.statusCode).send(result.body);
    } catch (e) {
      this._loggerService.catch(e);

      // TODO: resolve e type with error provider instance of when provider has been implement.
      res.status(500).send();
    }
  };

  protected _getParams(
    param: { "*": string },
    aParams: NSchemaService.RouteParam[] | null,
    res: Fastify.Response
  ) {
    let params: Record<string, string | null> = {};
    const dynamicParams = param["*"];
    if (
      aParams &&
      aParams.length > 0 &&
      dynamicParams &&
      dynamicParams.length > 0
    ) {
      const dynamic: string[] = dynamicParams.split("/");

      const obj: Record<
        string,
        { scope: "required" | "optional"; value: string }
      > = {};
      aParams.forEach(
        (p, i) => (obj[p.name] = { scope: p.scope, value: dynamic[i] })
      );

      params = aParams.reduce(
        (
          acc: Record<string, string | null>,
          param: NSchemaService.RouteParam
        ) => {
          const parameter = obj[param.name];
          switch (parameter.scope) {
            case "required":
              if (!parameter.value) {
                return res
                  .status(400)
                  .send({ message: `Header '${param.name}' is required` });
              } else {
                acc[param.name] = parameter.value;
              }
              break;
            case "optional":
              acc[param.name] = parameter.value ?? null;
              break;
          }
          return acc;
        },
        {}
      );
    }

    return params;
  }

  protected _getDomainStorage(
    service: string,
    domain: string
  ): NHttpService.StorageResult {
    const sStorage = this._schemaService.schema.get(service);

    if (!sStorage) {
      return {
        type: "fail",
        message: `Service '${sStorage}' not found. Supported services: ${Array.from(
          this._schemaService.schema.keys()
        )}`,
      };
    }

    const dStorage = sStorage.get(domain);
    if (!dStorage) {
      return {
        type: "fail",
        message: `Domain '${domain}' not found in '${sStorage}' service. Supported domains: ${Array.from(
          sStorage.keys()
        )}`,
      };
    }

    return { type: "success", domain: dStorage };
  }
}
