import { injectable } from "inversify";
import { AbstractService } from "./abstract.service";

import type { IHttpService } from "~core-types";

@injectable()
export class HttpService extends AbstractService implements IHttpService {}
