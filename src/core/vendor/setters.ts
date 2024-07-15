import type { NSchemaLoader } from "~core-types";

export const SCHEMA_SERVICES: NSchemaLoader.ServiceStructure[] = [];

export const setServices = (
  services: NSchemaLoader.ServiceStructure[]
): void => {
  SCHEMA_SERVICES.length = 0;
  SCHEMA_SERVICES.push(...services);
};

export const setService = <S extends string>(
  service: S,
  domains: NSchemaLoader.DomainStructure[]
): NSchemaLoader.ServiceStructure<S> => {
  return { service, domains };
};

// domain structures
export const setRegistry = <D extends string>(
  domain: D,
  documents: NSchemaLoader.DocumentsStructure
): NSchemaLoader.DomainStructure => {
  return { domain, documents };
};

export const setRouter = <R extends string>(
  structure: NSchemaLoader.RouterStructure<R>
): NSchemaLoader.RouterStructure => {
  return structure;
};

export const setMongoSchema = <T>(
  structure: NSchemaLoader.MongoSchemaStructure<T>
): NSchemaLoader.MongoSchemaStructure<T> => {
  return structure;
};
