import type { IAbstractService } from "./abstract.service";

export interface IConfigurationService extends IAbstractService {}

export namespace NConfigurationService {
  export type CoreConfig = {
    connectors: {
      mongodb: {
        enable: boolean;
        database: string;
        connect: {
          protocol: string;
          host: string;
          port: number;
        };
        auth: {
          username: string;
          password: string;
        };
      };
    };
    redis: {
      enable: boolean;
      connect: {
        protocol: string;
        host: string;
        port: number;
      };
    };
    rabbitMQ: {
      enable: boolean;
      protocol: string;
      host: string;
      port: number;
      username: string;
      password: string;
      locale: string;
      frameMax: number;
      heartBeat: number;
      vhost: string;
    };
    services: {
      scheduler: {
        enable: boolean;
        maxTask?: number | "no-validate";
        periodicity: number;
        workers: {
          minWorkers?: number | "max";
          maxWorkers?: number;
          maxQueueSize?: number;
          workerType?: "auto" | "web" | "process" | "thread";
          workerTerminateTimeout?: number;
        };
      };
    };
  };
}
