import { NextSeo, NextSeoProps } from "next-seo";
import { useTranslation } from "react-i18next";

type IProps = NextSeoProps & {
  omitSuffix?: boolean;
};

export const AppHead = (props: IProps) => {
  const { t } = useTranslation();

  const titleArray = [];
  if (props.title) {
    titleArray.push(props.title);
  }

  if (!props.omitSuffix) {
    titleArray.push(t("appName"));
  }

  const title = titleArray.join(" | ");
  const description = props.description || t("appDescription");

  return <NextSeo {...props} title={title} description={description} />;
};
