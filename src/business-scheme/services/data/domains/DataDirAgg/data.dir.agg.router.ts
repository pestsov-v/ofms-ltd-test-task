import { setRouter } from "~vendor";
import { NHttpService } from "~core-types";

export const DataDirAggRouter = setRouter({
  data: {
    GET: {
      version: "v1",
      handler: async (
        req,
        agents
      ): Promise<NHttpService.Response<{ status: 1 }>> => {
        return {
          statusCode: 200,
          body: {
            status: 1,
          },
        };
      },
    },
  },
});
