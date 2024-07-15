export interface IRabbitMQTunnel {
  sendToQueue<P = any>(queue: string, payload?: P): void;
}
