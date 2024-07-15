import { inject, injectable } from "~packages";
import { container } from "~container";
import { Tokens } from "~tokens";

import type {
  AnyFn,
  ILoggerService,
  ITaskService,
  NTaskScheduler,
  IFunctionalityAgent,
  NFunctionalityAgent,
  ITaskScheduler,
  IRabbitMQTunnel,
} from "~core-types";

@injectable()
export class FunctionalityAgent implements IFunctionalityAgent {
  constructor(
    @inject(Tokens.LoggerService)
    private readonly _loggerService: ILoggerService,
    @inject(Tokens.TaskService)
    private readonly _taskService: ITaskService
  ) {}

  public get logger(): NFunctionalityAgent.Logger {
    return {
      api: (msg) => {
        return this._loggerService.api(msg);
      },
      error: (msg) => {
        return this._loggerService.error(msg);
      },
    };
  }

  public get scheduler(): NFunctionalityAgent.Scheduler {
    return {
      on: (event: NTaskScheduler.Event, listener: AnyFn): void => {
        this._taskService.on(event, listener);
      },
      once: (event: NTaskScheduler.Event, listener: AnyFn): void => {
        this._taskService.on(event, listener);
      },
      off: (event: NTaskScheduler.Event, listener: AnyFn): void => {
        this._taskService.off(event, listener);
      },
      removeListener: (event: NTaskScheduler.Event, listener: AnyFn): void => {
        this._taskService.removeListener(event, listener);
      },
      set: <K extends string>(
        name: K,
        task: NTaskScheduler.Task
      ): ITaskScheduler => {
        return this._taskService.set(name, task);
      },
      get: <K extends string>(event: K): NTaskScheduler.Task | undefined => {
        return this._taskService.get<K>(event);
      },
      delete: <K extends string>(event: K): boolean => {
        return this._taskService.delete(event);
      },
    };
  }

  public get broker(): NFunctionalityAgent.Broker {
    const tunnel = container.get<IRabbitMQTunnel>(Tokens.RabbitMQTunnel);

    return {
      sendToQueue: <P>(
        service: string,
        domain: string,
        version: string,
        queue: string,
        payload: P
      ): void => {
        const name = `${service}.${domain}.${version}.${queue}`;
        tunnel.sendToQueue<P>(name, payload);
      },
    };
  }
}
