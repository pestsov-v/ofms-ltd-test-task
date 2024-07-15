export type HttpMethod =
  | "GET"
  | "POST"
  | "UPDATE"
  | "PUT"
  | "DELETE"
  | "OPTIONS";
export type Version = "v1" | "v2" | "v3" | `v${number}`;

export type AnyFn = ((...args) => any) | ((...args: any) => Promise<any>);
