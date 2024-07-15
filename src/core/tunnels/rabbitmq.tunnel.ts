import { injectable, inject } from "~packages";
import { Tokens } from "~tokens";

import type {
  ILoggerService,
  IRabbitMQTunnel,
  IRabbitMQConnector,
} from "~core-types";

@injectable()
export class RabbitMQTunnel implements IRabbitMQTunnel {
  constructor(
    @inject(Tokens.RabbitMQConnector)
    private readonly _rabbitMQConnector: IRabbitMQConnector,
    @inject(Tokens.LoggerService)
    private readonly _loggerService: ILoggerService
  ) {}

  public sendToQueue(queue: string, data: any): void {
    this._rabbitMQConnector.connection.createChannel((e, channel) => {
      if (e) {
        this._loggerService.catch(e);
        throw e;
      }

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    });
  }
}
