import { IAbstractConnector } from "./abstract.connector";
import { NConfigurationService } from "../services";

export interface IRedisConnector extends IAbstractConnector {}

export namespace NRedisConnector {
  export type Config = Pick<
    NCo.CoreConfig["connectors"]["redis"],
    "enable" | "connect"
  > &
    Pick<NConfigurationService.CoreConfig["connectors"]["redis"]>;
}
