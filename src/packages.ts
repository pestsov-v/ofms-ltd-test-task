// internal
import libEvents from "events";

// external
import { inject, injectable, Container, ContainerModule } from "inversify";

export const events = {
  EventEmitter: libEvents.EventEmitter,
};

export { inject, injectable };

export const inversify = {
  Container,
  ContainerModule,
} as const;
