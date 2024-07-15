import type { IAbstractService } from "./abstract.service";

export interface ILoggerService extends IAbstractService {
  system(msg: string): void;
  error(msg: string): void;
  catch(msg: unknown): void;
  api(msg: string): void;
  warn(msg: string): void;
}
