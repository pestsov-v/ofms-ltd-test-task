// internal
import libEvents from "events";

// external
import { inject, injectable, Container, ContainerModule } from "inversify";
import libFastify from "fastify";
import libMongoose from "mongoose";
import libIoredis from "ioredis";
import libAmqp from "amqplib/callback_api";
import { v4 } from "uuid";

export const events = {
  EventEmitter: libEvents.EventEmitter,
};

export { inject, injectable };

export const inversify = {
  Container,
  ContainerModule,
} as const;

export const fastify = {
  fastify: libFastify,
};

export const mongoose = {
  connect: libMongoose.connect,
};

export const ioredis = {
  ioredis: libIoredis,
};

export const rabbitMQ = {
  connect: libAmqp.connect,
};

export const uuid = {
  v4,
};
