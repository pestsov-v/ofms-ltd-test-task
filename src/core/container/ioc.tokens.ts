export const Tokens = {
  // Services
  ConfigurationService: Symbol("ConfigurationService"),
  LoggerService: Symbol("LoggerService"),
  SchemaService: Symbol("SchemaService"),
  HttpService: Symbol("HttpService"),
  TaskService: Symbol("TaskService"),

  // Loaders
  SchemaLoader: Symbol("SchemaLoader"),

  // Connectors
  ComputeConnector: Symbol("ComputeConnector"),

  // Initiator
  Initiator: Symbol("Initiator"),
} as const;
