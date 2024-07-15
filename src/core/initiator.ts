import { injectable, inject } from "~packages";
import { Tokens } from "~tokens";

import type { IAbstractConnector, IInitiator } from "~core-types";

@injectable()
export class Initiator implements IInitiator {
  constructor(
    @inject(Tokens.ComputeConnector)
    private readonly _computeConnector: IAbstractConnector
  ) {}

  public async start(): Promise<void> {
    try {
      await this._computeConnector.start();
    } catch (e) {
      // TODO: implement error provider with signal generate methods
      throw e;
    }
  }

  public async stop(): Promise<void> {
    try {
      await this._computeConnector.stop();
    } catch (e) {
      // TODO: implement error provider with signal generate methods
      throw e;
    }
  }
}
