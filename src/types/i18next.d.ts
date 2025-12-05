import "i18next";

import { i18nResources } from "@/config/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    resources: typeof i18nResources.en;
  }
}
