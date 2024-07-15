// internal
import libEvents from "events";

// external
import { inject, injectable, Container, ContainerModule } from "inversify";
import libFastify from "fastify";
import libMongoose from "mongoose";
import libIoredis from "ioredis";

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
