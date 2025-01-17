import { inversify } from "~packages";
import { Tokens } from "~tokens";

import {
  ConfigurationService,
  LoggerService,
  SchemaService,
  HttpService,
  TaskService,
} from "../services";
import {
  ComputeConnector,
  MongoConnector,
  RedisConnector,
  RabbitMQConnector,
} from "../connectors";
import { SchemaLoader } from "../loaders";
import { Initiator } from "../initiator";
import { FunctionalityAgent } from "../agents";
import { MongoTunnel, RabbitMQTunnel } from "../tunnels";

import type {
  IComputeConnector,
  IConfigurationService,
  ILoggerService,
  IHttpService,
  ISchemaService,
  IInitiator,
  ITaskService,
  ISchemaLoader,
  IFunctionalityAgent,
  IMongoConnector,
  IRedisConnector,
  IRabbitMQConnector,
  IRabbitMQTunnel,
  IMongoTunnel,
} from "~core-types";

export const Module = new inversify.ContainerModule((bind) => {
  // Agents
  bind<IFunctionalityAgent>(Tokens.FunctionalityAgent)
    .to(FunctionalityAgent)
    .inTransientScope();

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

  // Loaders
  bind<ISchemaLoader>(Tokens.SchemaLoader).to(SchemaLoader).inTransientScope();

  // Connectors
  bind<IComputeConnector>(Tokens.ComputeConnector)
    .to(ComputeConnector)
    .inSingletonScope();
  bind<IMongoConnector>(Tokens.MongoConnector)
    .to(MongoConnector)
    .inSingletonScope();
  bind<IRedisConnector>(Tokens.RedisConnector)
    .to(RedisConnector)
    .inSingletonScope();
  bind<IRabbitMQConnector>(Tokens.RabbitMQConnector)
    .to(RabbitMQConnector)
    .inSingletonScope();

  // Tunnels
  bind<IRabbitMQTunnel>(Tokens.RabbitMQTunnel)
    .to(RabbitMQTunnel)
    .inTransientScope();
  // Tunnels
  bind<IMongoTunnel>(Tokens.MongoTunnel).to(MongoTunnel).inTransientScope();

  // Initiator
  bind<IInitiator>(Tokens.Initiator).to(Initiator).inRequestScope();
});
