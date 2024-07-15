import { injectable } from "~packages";
import { AbstractService } from "./abstract.service";

import type { ILoggerService } from "~core-types";

@injectable()
export class LoggerService extends AbstractService implements ILoggerService {}
