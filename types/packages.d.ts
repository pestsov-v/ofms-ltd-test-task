// internal
import type events from "events";
import type fastify from "fastify";
import type { Redis, RedisOptions } from "ioredis";
import type libAmqp from "amqplib/callback_api";

export namespace Events {
  export type EventEmitter = events.EventEmitter;
}

export namespace Fastify {
  export type Request = fastify.FastifyRequest;
  export type Response = fastify.FastifyReply;
  export type Instance = fastify.FastifyInstance;
}

export namespace Mongoose {
  export type Mongoose = mongoose.Mongoose;
  export type ConnectionOptions = mongoose.ConnectOptions;
  export type Models = mongoose.Models;
  export type AnyKeys<T> = mongoose.AnyKeys<T>;

  export type Docs<TRawDocType, DocContents = AnyKeys<TRawDocType>> = Array<
    TRawDocType | DocContents
  >;
  export type SaveOptions = mongoose.SaveOptions;
  export type SchemaDefinition<T> = mongoose.SchemaDefinition<T>;
  export type SchemaOptions = mongoose.SchemaOptions;
}

export namespace IoRedis {
  export type IoRedis = Redis;
  export type IoRedisOptions = RedisOptions;
}

export namespace RabbitMQ {
  export type Connection = libAmqp.Connection;
  export type Channel = libAmqp.Channel;
  export type QueueOptions = libAmqp.Options.AssertQueue;
  export type ExchangeOptions = libAmqp.Options.AssertExchange;
  export type ConsumeOptions = libAmqp.Options.Consume;
  export type Message = libAmqp.Message;
}
