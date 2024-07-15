import type { IAbstractConnector } from "./abstract.connector";
import { RabbitMQ } from "~packages-types";
import { NSchemaService } from "../services";

export interface IRabbitMQConnector extends IAbstractConnector {
  readonly connection: RabbitMQ.Connection;
}

export namespace NRabbitMQConnector {
  export type Config = Pick<
    NDiscoveryService.CoreConfig["connectors"]["rabbitMQ"],
    | "enable"
    | "protocol"
    | "host"
    | "port"
    | "username"
    | "password"
    | "locale"
    | "frameMax"
    | "heartBeat"
    | "vhost"
  >;

  export type Handler = (
    msg: RabbitMQ.Message,
    agents: NSchemaService.Agents
  ) => Promise<void>;

  export type TopicKind = "queue" | "exchange";

  export interface BaseTopic {
    type: TopicKind;
    scope: "public" | "private";
    version: string;
    handler: Handler;
  }

  export interface QueueTopic extends BaseTopic {
    type: "queue";
    queue?: RabbitMQ.QueueOptions;
    consume?: RabbitMQ.ConsumeOptions;
  }

  export interface ExchangeTopic extends BaseTopic {
    type: "exchange";
    exchange?: RabbitMQ.ExchangeOptions;
  }

  export type Topic = QueueTopic | ExchangeTopic;

  // common
  export type QueueContract = {
    channel: RabbitMQ.Channel;
    service: string;
    domain: string;
    queue: string;
    topic: NRabbitMQConnector.QueueTopic;
  };

  export type ExchangeContract = {
    channel: RabbitMQ.Channel;
    queue: string;
    topic: NRabbitMQConnector.ExchangeTopic;
  };
}
