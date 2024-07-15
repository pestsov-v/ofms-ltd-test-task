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
  };
}
