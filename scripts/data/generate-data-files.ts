/* eslint-disable no-console */
/* eslint-disable n/no-process-env */
/* eslint-disable import/no-extraneous-dependencies */
import fs from "fs";
import path from "path";
import prettier from "prettier";

const fileTypes = ["models", "api", "queries", "utils", "errors"] as const;

type DataFileType = (typeof fileTypes)[number];

type DataContentFn = (config: FileConfig & { capitalizedDomain: string }) => string;

const dataFileContentMap: Record<DataFileType, DataContentFn> = {
  models: ({ capitalizedDomain }) => `
    import { z } from "zod";

    export namespace ${capitalizedDomain}Models {
      export const ${capitalizedDomain}Schema = z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
      });

      export type ${capitalizedDomain} = z.infer<typeof ${capitalizedDomain}Schema>;

      export const ${capitalizedDomain}ListResponseSchema = z.object({
        data: z.array(${capitalizedDomain}Schema),
      });

      export type ${capitalizedDomain}ListResponse = z.infer<typeof ${capitalizedDomain}ListResponseSchema>;

      export const ${capitalizedDomain}DetailsSchema = z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
      });

      export type ${capitalizedDomain}Details = z.infer<typeof ${capitalizedDomain}DetailsSchema>;

      export const Create${capitalizedDomain}RequestSchema = z.object({
        name: z.string(),
        description: z.string(),
      });

      export type Create${capitalizedDomain}Request = z.infer<typeof Create${capitalizedDomain}RequestSchema>;
    }
    `,
  api: ({ domain, capitalizedDomain }) => `
    import { AppRestClient } from "@/util/rest/clients/app-rest-client";
    import { ${capitalizedDomain}Models } from "@/${dir}/${domain}/${domain}.models";
    import { ${capitalizedDomain}Errors } from "@/${dir}/${domain}/${domain}.errors";

    export namespace ${capitalizedDomain}Api {
      export const list = () => {
        return AppRestClient.get(
          {
            resSchema: ${capitalizedDomain}Models.${capitalizedDomain}ListResponseSchema,
          },
          \`/${domain}\`
        );
      };

      export const get = (id: number) => {
        return AppRestClient.get(
          {
            resSchema: ${capitalizedDomain}Models.${capitalizedDomain}DetailsSchema,
          },
          \`/${domain}/\${id}\`
        );
      };

      export const create = (data: ${capitalizedDomain}Models.Create${capitalizedDomain}Request) => {
        return AppRestClient.post(
          {
            resSchema: ${capitalizedDomain}Models.Create${capitalizedDomain}RequestSchema,
            errorHandler: ${capitalizedDomain}Errors.Create,
          },
          \`/${domain}\`,
          data
        );
      };
    }
  `,
  queries: ({ domain, capitalizedDomain, dir }) => `
    import { ${capitalizedDomain}Api } from "@/${dir}/${domain}/${domain}.api";
    import { useQuery, useMutation } from "@tanstack/react-query";

    export namespace ${capitalizedDomain}Queries {
      export const keys = {
        all: ["${domain}"] as const,
        list: () => [...keys.all, "list"] as const,
        details: () => [...keys.all, "details"] as const,
        detail: (id: number) => [...keys.details(), id] as const,
      };

      export const useList = () => {
        return useQuery({
          queryKey: keys.list(),
          queryFn: ${capitalizedDomain}Api.list,
        });
      };

      export const useDetails = (id: number) => {
        return useQuery({
          queryKey: keys.detail(id),
          queryFn: () => ${capitalizedDomain}Api.get(id),
        });
      };

      export const useCreate = () => {
        return useMutation({
          mutationFn: ${capitalizedDomain}Api.create,
        });
      };
    }
  `,
  utils: ({ domain, capitalizedDomain, dir }) => `
    import { ${capitalizedDomain}Models } from "@/${dir}/${domain}/${domain}.models";

    export namespace ${capitalizedDomain}Utils {
      export const greet = (${domain}: ${capitalizedDomain}Models.${capitalizedDomain}) => {
        return \`Hello \${${domain}.name}\`;
      };
    }
  `,
  errors: ({ domain, capitalizedDomain }) => `
    import i18n from "@/config/i18n";
    import { StringUtils } from "@/util/string.utils";
    import { ErrorHandler } from "@/util/vendor/error-handling";

    export namespace ${capitalizedDomain}Errors {

      export type CreateErrorCodes = "NAME_EXISTS";

      export const Create = new ErrorHandler<CreateErrorCodes>([
        {
          code: "NAME_EXISTS",
          condition: (e) => {
            if (e instanceof Error) {
              return StringUtils.containsCaseInsensitive(
                e.message,
                "A ${domain} with the given name already exists"
              );
            }

            return false;
          },
          getMessage: () => i18n.t("hello.create.nameExists"),
        },
      ]);
    }
  `,
};

type CmdArgs = {
  domain: string;
  dir: string;
};

type FileConfig = CmdArgs & { fileType: DataFileType };

let dataDirectoryExists: boolean | null = null;

async function generateFile({ domain, dir, fileType }: FileConfig) {
  const directoryPath = path.join(__dirname, "../../src", dir, domain);

  if (dataDirectoryExists === null) {
    dataDirectoryExists = fs.existsSync(directoryPath);
  }
  if (!dataDirectoryExists) {
    fs.mkdirSync(directoryPath, { recursive: true });
    dataDirectoryExists = true;
  }

  const fileName = `${domain}.${fileType}.ts`;
  const filePath = path.join(directoryPath, fileName);
  const content = dataFileContentMap[fileType]({
    domain,
    dir,
    fileType,
    capitalizedDomain: capitalize(domain),
  });
  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  fs.writeFileSync(filePath, formattedContent);
  console.log(`Generated ${filePath}`);
}

function generateDomainFiles({ domain, dir }: CmdArgs) {
  console.log(`Generating "${domain}" data files in "${dir}"...`);
  for (const fileType of fileTypes) {
    generateFile({ domain, dir, fileType });
  }
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const DEFAULT_DIRECTORY = process.env.DEFAULT_DATA_DIRECTORY ?? "data";
const [domain, dir = DEFAULT_DIRECTORY] = process.argv.slice(2);

if (!domain) {
  console.error("Cannot read <domain> argument");
  process.exit(1);
}

generateDomainFiles({ domain, dir });
