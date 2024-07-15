export const Tokens = {
  // Agents
  FunctionalityAgent: Symbol("FunctionalityAgent"),

  // Services
  ConfigurationService: Symbol("ConfigurationService"),
  LoggerService: Symbol("LoggerService"),
  SchemaService: Symbol("SchemaService"),
  HttpService: Symbol("HttpService"),
  TaskService: Symbol("TaskService"),

  // Tunnels
  MongoTunnel: Symbol("MongoTunnel"),

  // Loaders
  SchemaLoader: Symbol("SchemaLoader"),

  // Connectors
  ComputeConnector: Symbol("ComputeConnector"),
  MongoConnector: Symbol("MongoConnector"),
  RedisConnector: Symbol("RedisConnector"),
  RabbitMQConnector: Symbol("RabbitMQConnector"),

  // Initiator
  Initiator: Symbol("Initiator"),
} as const;
