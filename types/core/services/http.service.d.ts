import { IAbstractService } from "./abstract.service";

export interface IHttpService extends IAbstractService {}

export namespace NHttpService {
  type StorageSuccess = {
    type: "success";
    domain: NSchemeService.Domain;
  };

  type StorageFail = {
    type: "fail";
    message: NAbstractHttpAdapter.ValidateMessage;
  };

  type StorageResult = StorageSuccess | StorageFail;

  export type ApiRequest<
    BODY = any,
    PARAMS = any,
    HEADERS = any,
    QUERIES = any
  > = {
    url: string;
    path: string;
    method: HttpMethod;
    body: BODY;
    headers: HEADERS;
    params: PARAMS;
    queries: QUERIES;
  };

  export type Response<B = any> = {
    statusCode?: number;
    body?: B;
    headers?: Record<string, string>;
  };

  export type ApiHandler = (
    request: ApiRequest,
    agents: NSchemaService.Agents
  ) => Promise<Response>;
}
