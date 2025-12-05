import { z } from "zod";

export namespace HealthcheckModels {
  /**
   * HttpHealthDtoSchema
   * @type { object }
   * @property { string } uptime
   * @property { string } stage
   * @property { string } version
   * @property { string } release
   * @property { string } buildTime
   */
  export const HttpHealthDtoSchema = z
    .object({ uptime: z.string(), stage: z.string(), version: z.string(), release: z.string(), buildTime: z.string() })
    .partial();
  export type HttpHealthDto = z.infer<typeof HttpHealthDtoSchema>;
}
