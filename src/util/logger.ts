import log from "loglevel";
import prefix from "loglevel-plugin-prefix";

import { AppConfig } from "@/config/app.config";

log.setLevel(AppConfig.log.level as log.LogLevelDesc);

prefix.reg(log);

prefix.apply(log, {
  template: "[%t] %l:",
  timestampFormatter: (date) => {
    return date.toISOString();
  },
});

export const logger = {
  info: log.info,
  debug: log.debug,
  warn: log.warn,
  error: log.error,
  trace: log.trace,
};
