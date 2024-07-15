import { injectable } from "~packages";
import { AbstractService } from "./abstract.service";

import type { IConfigurationService } from "~core-types";

@injectable()
export class ConfigurationService
  extends AbstractService
  implements IConfigurationService
{
  protected _SERVICE_NAME = ConfigurationService.name;
  protected _loggerService = undefined;

  protected async init(): Promise<boolean> {
    return true;
  }

  protected async destroy(): Promise<void> {}
}
