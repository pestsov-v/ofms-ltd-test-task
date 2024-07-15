import { injectable } from "~packages";
import { AbstractService } from "./abstract.service";

import type { IConfigurationService } from "~core-types";

@injectable()
export class ConfigurationService
  extends AbstractService
  implements IConfigurationService {}
