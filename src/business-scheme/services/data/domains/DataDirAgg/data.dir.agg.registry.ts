import { setRegistry } from "~vendor";

import { DataDirAggRouter } from "./data.dir.agg.router";

export const DataDirAggRegistry = setRegistry("DataDirAgg", {
  router: DataDirAggRouter,
});
