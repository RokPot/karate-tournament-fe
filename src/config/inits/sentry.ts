import * as Sentry from "@sentry/react";

import { AppConfig } from "@/config/app.config";

export function initSentry() {
  Sentry.init({
    release: AppConfig.version,
    enabled: AppConfig.sentry.enabled,
    dsn: AppConfig.sentry.dsn,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

    tracesSampleRate: AppConfig.sentry.tracesSampleRate,

    replaysSessionSampleRate: AppConfig.sentry.replaysSessionSampleRate,
    replaysOnErrorSampleRate: AppConfig.sentry.replaysOnErrorSampleRate,
  });
}
