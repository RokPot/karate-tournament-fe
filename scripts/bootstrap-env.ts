/* eslint-disable no-console */
/* eslint-disable n/no-process-env */
import fs from "fs";
import { load } from "js-yaml";
import path from "path";

const STAGE = process.argv[2] || "local";
const CWD = path.join(__dirname, "..");

interface SpaDeployConfig {
  region?: string;
  accountId?: string;
  configs: {
    destination: string;
    values: Array<{
      name: string;
      configFrom?: string;
      value?: string;
      valueFrom?: string;
    }>;
  };
}

function resolveResource(value: string, options: { stage?: string; release?: string }): any {
  if (value.startsWith("func:")) {
    switch (value.slice(5)) {
      case "timestamp":
        return new Date().toISOString();
      case "stage":
        return options.stage || "local";
      case "release":
        return options.release || "";
      default:
        throw new Error(`Unknown function '${value}'`);
    }
  }
  if (value.startsWith("env:")) {
    return process.env[value.slice(4)];
  }
  // For other types (arn:aws:ssm, config:, etc.), we can extend later
  throw new Error(`Cannot resolve resource '${value}'`);
}

async function resolveConfig(value: any, options: { stage?: string; release?: string }): Promise<any> {
  if (value !== null && value !== undefined) {
    if (typeof value === "object" && !Array.isArray(value)) {
      const resolved: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        resolved[k] = await resolveConfig(v, options);
      }
      return resolved;
    }
    if (Array.isArray(value)) {
      return Promise.all(value.map((v) => resolveConfig(v, options)));
    }
    if (typeof value === "string") {
      const match = value.match(/\$\{([^}]+)\}/);
      if (match) {
        const resource = match[1];
        const resolved = await resolveResource(resource, options);
        return value.replace(/\$\{[^}]+\}/g, resolved);
      }
    }
  }
  return value;
}

function loadConfig(moduleName: string, cwd: string, stage: string): any {
  const configDir = path.join(cwd, ".config");
  const configNames = [`${moduleName}`, `${stage}.${moduleName}`, `${stage}.${moduleName}.local`];

  for (const name of configNames) {
    for (const ext of [".yml", ".yaml", ".json"]) {
      const configPath = path.join(configDir, `${name}${ext}`);
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, "utf-8");
        if (ext === ".json") {
          return JSON.parse(content);
        }
        return load(content) as any;
      }
    }
  }

  throw new Error(`Could not find config '${moduleName}' for stage ${stage}`);
}

function generateIni(data: Record<string, any>): string {
  return Object.entries(data)
    .map(([key, value]) => {
      try {
        switch (typeof value) {
          case "object":
            return `${key}="${JSON.stringify(value).replace(/"/g, '\\"').replace(/\r?\n/g, "\\n")}"`;
          case "string":
          case "boolean":
          case "number":
            return `${key}="${value
              .toString()
              // escape quotes
              .replace(/"/g, '\\"')
              // and newlines
              .replace(/\r?\n/g, "\\n")}"`;
          case "undefined":
            console.warn(`${key} is undefined`);
            return "";
          default:
            console.warn(`${key} has invalid value:`, value);
            return "";
        }
      } catch (e: any) {
        console.error(`Error processing ${key}:`, e);
        return "";
      }
    })
    .filter((line) => line !== "")
    .join("\n");
}

async function resolveZeConfigItem(
  configItem: SpaDeployConfig["configs"],
  options: { stage: string; release?: string },
  cwd: string,
): Promise<Record<string, any>> {
  let tree: Record<string, any> = {};

  for (const { name, configFrom, value, valueFrom } of configItem.values) {
    let resolvedValue: any;

    if (value !== undefined) {
      resolvedValue = value;
    } else if (valueFrom) {
      resolvedValue = resolveResource(valueFrom, options);
    } else if (configFrom) {
      // Load template config
      const templateConfig = loadConfig(configFrom, cwd, options.stage);
      // Resolve all variables in the template
      resolvedValue = await resolveConfig(templateConfig, options);
    } else {
      throw new Error("Exactly one of valueFrom, configFrom, or value must be specified");
    }

    if (resolvedValue !== undefined) {
      if (name === "@") {
        // Merge into root
        if (typeof resolvedValue !== "object") {
          throw new Error(`Cannot set root value to "${resolvedValue}"`);
        }
        tree = { ...tree, ...resolvedValue };
      } else {
        // Set at specific path
        tree[name] = resolvedValue;
      }
    }
  }

  return tree;
}

async function bootstrap() {
  try {
    // Load spa-deploy config
    const config = loadConfig("spa-deploy", CWD, STAGE) as SpaDeployConfig;

    if (!config.configs) {
      throw new Error("No configs found in spa-deploy config");
    }

    // Resolve config values
    const envData = await resolveZeConfigItem(config.configs, { stage: STAGE }, CWD);

    // Generate .env file
    const output = generateIni(envData);
    const outputPath = path.resolve(CWD, config.configs.destination);

    console.log(`Writing ${outputPath}`);
    fs.writeFileSync(outputPath, output);

    console.log(`✓ Created ${outputPath}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

bootstrap();
