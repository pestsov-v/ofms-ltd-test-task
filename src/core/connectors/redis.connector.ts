import { injectable, inject, ioredis } from "~packages";
import { Tokens } from "~tokens";
import { AbstractConnector } from "./abstract.connector";

import type { IoRedis } from "~packages-types";
import type {
  IConfigurationService,
  ILoggerService,
  IRedisConnector,
  NRedisConnector,
} from "~core-types";

@injectable()
export class RedisConnector
  extends AbstractConnector
  implements IRedisConnector
{
  protected readonly _CONNECTOR_NAME = RedisConnector.name;
  private _config: NRedisConnector.Config;
  private _connection: IoRedis.IoRedis | undefined;

  constructor(
    @inject(Tokens.ConfigurationService)
    private readonly _confService: IConfigurationService,
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService
  ) {
    super();

    this._config = {
      enable: true,
      connect: {
        host: "0.0.0.0",
        protocol: "redis",
        port: 6379,
      },
      retryCount: 5,
      retryTimeout: 10000,
      showFriendlyErrorStack: true,
    };
  }

  protected async init(): Promise<void> {
    if (!this._config.enable) {
      this._loggerService.warn(`${RedisConnector.name} is disabled.`);
      return;
    }

    const { protocol, host, port } = this._config.connect;
    const url = `${protocol}://${host}:${port}`;

    const redisOptions: IoRedis.IoRedisOptions = {
      host: host,
      port: port,
      showFriendlyErrorStack: this._config.showFriendlyErrorStack,
      retryStrategy: () => this._config.retryTimeout,
    };

    try {
      this._connection = new ioredis.ioredis(url, redisOptions);
    } catch (e) {
      this._loggerService.catch(e);
      throw e;
    }

    this._loggerService.system(
      `${RedisConnector.name} has been started on ${url}.`
    );
  }

  protected async destroy(): Promise<void> {
    if (!this._connection) return;

    try {
      this._connection.disconnect();
    } catch (e) {
      this._loggerService.catch(e);
    }

    this._connection = undefined;

    this._loggerService.system(`${RedisConnector.name} has been stopped.`);
  }

  public get connection(): IoRedis.IoRedis {
    if (!this._connection) {
      throw new Error('"Redis connection is not initialize."');
    }

    return this._connection;
  }
}
