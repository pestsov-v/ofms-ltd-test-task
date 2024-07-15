import { inversify } from "~packages";
import { Tokens } from "~tokens";

import {
  ConfigurationService,
  LoggerService,
  SchemaService,
  HttpService,
  TaskService,
} from "../services";
import { ComputeConnector } from "../connectors";

import { Initiator } from "../initiator";

import type {
  IComputeConnector,
  IConfigurationService,
  ILoggerService,
  IHttpService,
  ISchemaService,
  IInitiator,
  ITaskService,
} from "~core-types";

export const Module = new inversify.ContainerModule((bind) => {
  // Services
  bind<IConfigurationService>(Tokens.ConfigurationService)
    .to(ConfigurationService)
    .inSingletonScope();
  bind<ILoggerService>(Tokens.LoggerService)
    .to(LoggerService)
    .inSingletonScope();
  bind<ISchemaService>(Tokens.SchemaService)
    .to(SchemaService)
    .inSingletonScope();
  bind<IHttpService>(Tokens.HttpService).to(HttpService).inSingletonScope();
  bind<ITaskService>(Tokens.TaskService).to(TaskService).inSingletonScope();

  // Connectors
  bind<IComputeConnector>(Tokens.ComputeConnector)
    .to(ComputeConnector)
    .inSingletonScope();

  // Initiator
  bind<IInitiator>(Tokens.Initiator).to(Initiator).inRequestScope();
});
