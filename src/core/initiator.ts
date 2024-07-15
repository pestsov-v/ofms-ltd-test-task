import { injectable, inject } from "~packages";
import { Tokens } from "~tokens";

import type {
  IAbstractConnector,
  IInitiator,
  IRedisConnector,
} from "~core-types";

@injectable()
export class Initiator implements IInitiator {
  constructor(
    @inject(Tokens.ComputeConnector)
    private readonly _computeConnector: IAbstractConnector,
    @inject(Tokens.MongoConnector)
    private readonly _mongoConnector: IAbstractConnector,
    @inject(Tokens.RedisConnector)
    private readonly _redisConnector: IRedisConnector
  ) {}

  public async start(): Promise<void> {
    try {
      await this._computeConnector.start();
      await this._mongoConnector.start();
      await this._redisConnector.start();
    } catch (e) {
      // TODO: implement error provider with signal generate methods
      throw e;
    }
  }

  public async stop(): Promise<void> {
    try {
      await this._redisConnector.stop();
      await this._mongoConnector.stop();
      await this._computeConnector.stop();
    } catch (e) {
      // TODO: implement error provider with signal generate methods
      throw e;
    }
  }
}
