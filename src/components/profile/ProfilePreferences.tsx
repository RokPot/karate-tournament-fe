import { ProfileField } from "@/components/profile/ProfileField";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { useLanguageSwitcher } from "@/hooks/useLanguageSwitcher";
import { useThemeStore } from "@/providers/ThemeModeContext";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const ProfilePreferences = () => {
  const { t, i18n } = useTranslation();
  const { languages, changeLanguage } = useLanguageSwitcher();
  const { isDarkMode, toggleThemeMode } = useThemeStore();

  const currentLanguage = i18n.language.startsWith("sl") ? "sl" : "en";

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    changeLanguage(event.target.value);
  };

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <Typography size="h2">{t("profile.preferences.title")}</Typography>
      <div className="flex flex-col gap-4">
        <ProfileField label={t("profile.preferences.language")}>
          <FormControl size="small" className="min-w-48">
            <InputLabel id="profile-language-label">
              {t("profile.preferences.language")}
            </InputLabel>
            <Select
              labelId="profile-language-label"
              label={t("profile.preferences.language")}
              value={currentLanguage}
              onChange={handleLanguageChange}
            >
              {languages.map((language) => (
                <MenuItem key={language.value} value={language.value}>
                  {language.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ProfileField>
        <ProfileField label={t("profile.preferences.theme")}>
          <FormControlLabel
            control={
              <Switch checked={!!isDarkMode} onChange={toggleThemeMode} />
            }
            label={
              isDarkMode
                ? t("profile.preferences.themeDark")
                : t("profile.preferences.themeLight")
            }
          />
        </ProfileField>
        <ProfileField label={t("profile.preferences.notifications")}>
          <div className="flex flex-col gap-1">
            <FormControlLabel
              disabled
              control={<Switch checked />}
              label={t("profile.preferences.tournamentReminders")}
            />
            <FormControlLabel
              disabled
              control={<Switch checked />}
              label={t("profile.preferences.invitationEmails")}
            />
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("profile.preferences.notificationsHint")}
            </Typography>
          </div>
        </ProfileField>
      </div>
    </div>
  );
};
