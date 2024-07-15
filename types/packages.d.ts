// internal
import type events from "events";
import type fastify from "fastify";

export namespace Events {
  export type EventEmitter = events.EventEmitter;
}

export namespace Fastify {
  export type Request = fastify.FastifyRequest;
  export type Response = fastify.FastifyReply;
  export type Instance = fastify.FastifyInstance;
}
