import { setService } from "~vendor";
import { DataDirAggRegistry } from "./domains";

import type { ServiceNames } from "@ba-common-types";

export const DataService = setService<ServiceNames>("data", [
  DataDirAggRegistry,
]);
