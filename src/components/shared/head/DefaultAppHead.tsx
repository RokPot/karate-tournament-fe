import { DefaultSeo } from "next-seo";
import { useTranslation } from "react-i18next";

export const DefaultAppHead = () => {
  const { t } = useTranslation();

  return <DefaultSeo title={t("appName")} description={t("appDescription")} />;
};
