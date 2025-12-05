export namespace UrlUtils {
  export const startLinkWithHttps = (url: string, prefix = "https://") => {
    if (!url) return "";
    if (url?.startsWith("http://") || url?.startsWith("https://")) return url;
    return `${prefix}${url}`;
  };

  export const linkifyText = (text?: string) => {
    if (!text) return undefined;
    const urlRegex =
      /(?:https?:\/\/)?(?:www\.[^\s,]+|\b(?:[a-z0-9](?:[-a-z0-9]{0,61}[a-z0-9])?\.)+[a-z]{2,63}\b[^\s,]*)/gi;
    const urls: string[] = [];
    const data = text.replaceAll(urlRegex, (url: string) => {
      urls.push(url);
      return "[REPLACER]";
    });
    const items = data.split("[REPLACER]");
    const linkifiedUrls = items.map((_, index) => startLinkWithHttps(urls[index]));
    return linkifiedUrls?.[0] ?? "";
  };

  export const getVideoIdFromUrl = (url: string, platform: "youtube" | "vimeo") => {
    if (platform === "youtube") {
      const youtubeRegex =
        /^.*(youtu.be\/|m\.youtube\.com\/|youtube\.com\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(youtubeRegex);
      return match && match[2].length === 11 ? match[2] : null;
    }
    const regExp = /vimeo.com\/(?:video\/)?(\d+)/;
    const match = url.match(regExp);
    return match?.[1];
  };

  export const parseTextWithLinks = (text: string) => {
    // Only match URLs that start with http://, https://, or www.
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+\.[^\s]+)/gi;
    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null = urlRegex.exec(text);

    while (match !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      const url = match[0];
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      parts.push({
        type: "link",
        content: url,
        url: fullUrl,
      });

      lastIndex = match.index + url.length;
      match = urlRegex.exec(text);
    }

    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: "text", content: text }];
  };

  // Social Media Handle Parsing Functions
  export const parseLinkedInHandle = (url: string): string => {
    if (!url) return "";

    // Remove protocol and www
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Handle different LinkedIn URL formats
    const patterns = [
      /^linkedin\.com\/in\/([^/?]+)/, // linkedin.com/in/username
      /^linkedin\.com\/company\/([^/?]+)/, // linkedin.com/company/companyname
      /^linkedin\.com\/([^/?]+)/, // linkedin.com/username (fallback)
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return "";
  };

  export const parseInstagramHandle = (url: string): string => {
    if (!url) return "";

    // Remove protocol and www
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Handle Instagram URL format
    const pattern = /^instagram\.com\/([^/?]+)/;
    const match = cleanUrl.match(pattern);

    return match ? match[1] : "";
  };

  export const parseYouTubeHandle = (url: string): string => {
    if (!url) return "";

    // Remove protocol and www
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Handle different YouTube URL formats
    const patterns = [
      /^youtube\.com\/@([^/?]+)/, // youtube.com/@username
      /^youtube\.com\/channel\/([^/?]+)/, // youtube.com/channel/channelid
      /^youtube\.com\/user\/([^/?]+)/, // youtube.com/user/username
      /^youtube\.com\/c\/([^/?]+)/, // youtube.com/c/customname
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return "";
  };

  export const parseFacebookHandle = (url: string): string => {
    if (!url) return "";

    // Remove protocol and www
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Handle Facebook URL format
    const pattern = /^facebook\.com\/([^/?]+)/;
    const match = cleanUrl.match(pattern);

    return match ? match[1] : "";
  };

  // Function to parse handle from any social media URL
  export const parseSocialMediaHandle = (
    url: string,
    platform: "linkedin" | "instagram" | "youtube" | "facebook",
  ): string => {
    switch (platform) {
      case "linkedin":
        return parseLinkedInHandle(url);
      case "instagram":
        return parseInstagramHandle(url);
      case "youtube":
        return parseYouTubeHandle(url);
      case "facebook":
        return parseFacebookHandle(url);
      default:
        return "";
    }
  };

  // Function to build social media URL from handle
  export const buildSocialMediaUrl = (
    handle: string,
    platform: "linkedin" | "instagram" | "youtube" | "facebook",
  ): string => {
    if (!handle) return "";

    switch (platform) {
      case "linkedin":
        return `https://linkedin.com/in/${handle}`;
      case "instagram":
        return `https://instagram.com/${handle}`;
      case "youtube":
        return `https://youtube.com/@${handle}`;
      case "facebook":
        return `https://facebook.com/${handle}`;
      default:
        return "";
    }
  };
}
