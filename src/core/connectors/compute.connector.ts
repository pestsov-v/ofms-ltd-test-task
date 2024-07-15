import { injectable } from "~packages";
import { AbstractConnector } from "./abstract.connector";

import type { IAbstractConnector } from "~core-types";

@injectable()
export class ComputeConnector
  extends AbstractConnector
  implements IAbstractConnector {}
