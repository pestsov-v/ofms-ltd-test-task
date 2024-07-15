// external
import { inject, injectable, Container, ContainerModule } from "inversify";

export { inject, injectable };

export const inversify = {
  Container,
  ContainerModule,
} as const;
