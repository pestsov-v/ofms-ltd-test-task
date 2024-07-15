import { injectable } from "~packages";

import type { IAbstractService } from "~core-types";

@injectable()
export abstract class AbstractService implements IAbstractService {}
