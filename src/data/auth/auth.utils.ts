import { AppConfig } from "@/config/app.config";
import { AuthModels } from "@/data/auth/auth.models";
import { RoutingUtils } from "@/util/routing.utils";

export namespace AuthUtils {
  export function getRedirectUri(provider: AuthModels.SocialProvider): string {
    return RoutingUtils.getCompleteUrlFromPath(
      `${AppConfig.authAuth0.socialRedirectPath}/${provider}`,
      {
        noTrailingSlash: true,
      },
    );
  }

  export function generateGoogleLoginUrl(
    credentials: AuthModels.SocialCredentialsResponse,
  ): string {
    const { baseUrl, clientId, scopes, responseType } = credentials;
    const redirectUri = getRedirectUri("google");

    const scopeParam = scopes.join(" ");
    return `${baseUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scopeParam)}`;
  }

  export function generateFacebookLoginUrl(
    credentials: AuthModels.SocialCredentialsResponse,
  ): string {
    const { baseUrl, clientId, responseType, scopes } = credentials;
    const redirectUri = getRedirectUri("facebook");

    const scopeParam = scopes.join(",");
    return `${baseUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scopeParam}`;
  }

  export function generateLoginUrl(
    provider: AuthModels.SocialProvider,
    credentials: AuthModels.SocialCredentialsResponse,
  ): string {
    switch (provider) {
      case "google": {
        return generateGoogleLoginUrl(credentials);
      }
      case "facebook": {
        return generateFacebookLoginUrl(credentials);
      }
      default:
        throw new Error(
          `Login with social provider "${provider}" is not supported`,
        );
    }
  }
}
