import { setRegistry } from "~vendor";

import { DataDirAggRouter } from "./data.dir.agg.router";
import { DataDirAggBroker } from "./data.dir.agg.broker";

export const DataDirAggRegistry = setRegistry("DataDirAgg", {
  router: DataDirAggRouter,
  broker: DataDirAggBroker,
});
