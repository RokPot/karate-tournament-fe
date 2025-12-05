import { z } from "zod";

export namespace TestModels {
  /**
   * TestGetResponseDtoSchema
   * @type { object }
   * @property { string } message Success message. Example: `GET endpoint works!`
   * @property { string } serverTime Current server time. Example: `2024-01-01T00:00:00.000Z`
   * @property { number } randomNumber Random number for testing. Example: `42`
   */
  export const TestGetResponseDtoSchema = z.object({
    message: z.string(),
    serverTime: z.string(),
    randomNumber: z.number(),
  });
  export type TestGetResponseDto = z.infer<typeof TestGetResponseDtoSchema>;

  /**
   * TestEchoResponseDtoSchema
   * @type { object }
   * @property { string } echo Echoed message. Example: `hello-world`
   */
  export const TestEchoResponseDtoSchema = z.object({ echo: z.string() });
  export type TestEchoResponseDto = z.infer<typeof TestEchoResponseDtoSchema>;

  /**
   * TestRequestDtoSchema
   * @type { object }
   * @property { string } name Name of the test user. Min Length: `2`. Max Length: `100`. Example: `John Doe`
   * @property { string } email Email address. Example: `john.doe@example.com`
   * @property { string } message Optional message. Max Length: `500`. Example: `Hello from Swagger!`
   */
  export const TestRequestDtoSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().optional(),
    message: z.string().max(500).optional(),
  });
  export type TestRequestDto = z.infer<typeof TestRequestDtoSchema>;

  /**
   * TestResponseDtoSchema
   * @type { object }
   * @property { string } message Success message. Example: `Test endpoint called successfully`
   * @property { string } timestamp Timestamp of the response. Example: `2024-01-01T00:00:00.000Z`
   * @property { object } data Request data that was received. Example: `[object Object]`
   */
  export const TestResponseDtoSchema = z.object({ message: z.string(), timestamp: z.string(), data: z.object({}) });
  export type TestResponseDto = z.infer<typeof TestResponseDtoSchema>;
}
