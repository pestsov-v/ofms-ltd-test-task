import { injectable, inject, rabbitMQ } from "~packages";
import { container } from "~container";
import { Tokens } from "~tokens";
import { AbstractConnector } from "./abstract.connector";

import type { RabbitMQ } from "~packages-types";
import type {
  ILoggerService,
  IRabbitMQConnector,
  NRabbitMQConnector,
  IFunctionalityAgent,
  NSchemaService,
  IConfigurationService,
  ISchemaService,
} from "~core-types";

injectable();
export class RabbitMQConnector
  extends AbstractConnector
  implements IRabbitMQConnector
{
  protected readonly _CONNECTOR_NAME = RabbitMQConnector.name;
  private _config: NRabbitMQConnector.Config;
  private _connection: RabbitMQ.Connection | undefined;

  constructor(
    @inject(Tokens.ConfigurationService)
    private readonly _confService: IConfigurationService,
    @inject(Tokens.LoggerService)
    protected readonly _loggerService: ILoggerService,
    @inject(Tokens.SchemaService)
    private readonly _schemaService: ISchemaService
  ) {
    super();

    this._config = {
      enable: true,
      protocol: "amqp",
      host: "0.0.0.0",
      port: 5672,
      username: "guest",
      password: "guest",
      locale: "en_US",
      frameMax: 0x1000,
      heartBeat: 0,
      vhost: "/",
    };
  }

  protected async init(): Promise<void> {
    if (!this._config.enable) {
      this._loggerService.warn(`${RabbitMQConnector.name} is disabled.`);
      return;
    }
    return new Promise((resolve, reject) => {
      rabbitMQ.connect(
        {
          protocol: this._config.protocol,
          hostname: this._config.host,
          port: this._config.port,
          username: this._config.username,
          password: this._config.password,
          locale: this._config.locale,
          frameMax: this._config.frameMax,
          heartbeat: this._config.heartBeat,
          vhost: this._config.vhost,
        },
        async (e, connection): Promise<void> => {
          if (e) {
            this._loggerService.catch(e);
            return reject(e);
          }

          if (this._connection) return resolve();

          const { protocol, host, port } = this._config;
          this._connection = connection;

          this._loggerService.system(
            `${RabbitMQConnector.name} has been started on ${protocol}://${host}:${port}.`
          );

          try {
            await this._subscribe();
            resolve();
          } catch (e) {
            this._loggerService.catch(e);
            reject(e);
          }
        }
      );
    });
  }

  protected async destroy(): Promise<void> {
    if (!this._connection) return;

    try {
      this.connection.close();
    } catch (e) {
      this._loggerService.system(`${RabbitMQConnector.name} has been stopped.`);
    } finally {
      this._connection = undefined;
    }
  }

  public get connection(): RabbitMQ.Connection {
    if (!this._connection) {
      throw new Error("RabbitMQ connection not initialize.");
    }

    return this._connection;
  }

  protected async _subscribe(): Promise<void> {
    this.connection.createChannel((e, channel) => {
      if (e) {
        this._loggerService.catch(e);
        throw e;
      }

      this._schemaService.brokerMessages.queues.forEach((q) => {
        this._consumeQueue(channel, q.service, q.topic);
      });

      this._schemaService.brokerMessages.exchange.forEach((q) => {
        this._consumeExchange(channel, q.queue, q.topic);
      });
    });
  }

  private async _consumeQueue(
    channel: RabbitMQ.Channel,
    queue: string,
    topic: NRabbitMQConnector.QueueTopic
  ): Promise<void> {
    const qOptions: RabbitMQ.QueueOptions = {
      durable: topic.queue?.durable ?? true,
      ...topic.queue,
    };
    const cOptions: RabbitMQ.ConsumeOptions = {
      noAck: topic.consume?.noAck ?? true,
      ...topic.consume,
    };

    channel.assertQueue(queue, qOptions);
    channel.consume(
      queue,
      async (msg: any): Promise<void> => {
        if (msg) {
          try {
            await this._callHandler(msg, topic);
          } catch (e) {
            this._loggerService.catch(e);
            throw e;
          }
        }
      },
      cOptions
    );
  }

  private async _consumeExchange(
    channel: RabbitMQ.Channel,
    queue: string,
    topic: NRabbitMQConnector.ExchangeTopic
  ): Promise<void> {
    throw new Error(
      `Method not implemented. Args: ${channel}, ${queue}, ${topic}`
    );
  }

  private async _callHandler(
    msg: RabbitMQ.Message,
    topic: NRabbitMQConnector.Topic
  ): Promise<void> {
    const agents: NSchemaService.Agents = {
      fnAgent: container.get<IFunctionalityAgent>(Tokens.FunctionalityAgent),
    };

    try {
      await topic.handler(msg, agents);
    } catch (e) {
      this._loggerService.catch(e);
    }
  }
}
