import { injectable } from "~packages";
import { AbstractService } from "./abstract.service";

import type { ISchemaService } from "~core-types";

@injectable()
export class SchemaService extends AbstractService implements ISchemaService {}
