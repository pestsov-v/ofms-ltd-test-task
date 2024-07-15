import { injectable } from "~packages";
import { AbstractService } from "./abstract.service";

import type { ITaskService } from "~core-types";

@injectable()
export class TaskService extends AbstractService implements ITaskService {}
