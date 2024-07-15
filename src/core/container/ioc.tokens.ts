export const Tokens = {
  // Services
  ConfigurationService: Symbol("ConfigurationService"),
  LoggerService: Symbol("LoggerService"),
  SchemaService: Symbol("SchemaService"),
  HttpService: Symbol("HttpService"),
  TaskService: Symbol("TaskService"),

  // Connectors
  ComputeConnector: Symbol("ComputeConnector"),

  // Initiator
  Initiator: Symbol("Initiator"),
} as const;
