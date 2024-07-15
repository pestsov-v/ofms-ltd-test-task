import { injectable } from "~packages";

import type { IInitiator } from "~core-types";

@injectable()
export class Initiator implements IInitiator {
  constructor() {}

  public async start(): Promise<void> {}

  public async stop(): Promise<void> {}
}
