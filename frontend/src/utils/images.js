import { API_BASE_URL, PRODUCTION_API_BASE_URL } from "./config";

const decodeImageNameSafely = (value) => {
  let decoded = String(value || "");

  // Decode once or twice to recover values like "%2520" -> "%20" -> " "
  for (let index = 0; index < 2; index += 1) {
    try {
      const nextValue = decodeURIComponent(decoded);
      if (nextValue === decoded) {
        break;
      }
      decoded = nextValue;
    } catch (error) {
      break;
    }
  }

  return decoded;
};

const normalizeImageName = (value) => {
  if (!value) return "";

  const image = String(value).trim();
  if (!image) return "";

  if (image.startsWith("data:")) {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    try {
      const url = new URL(image);
      const uploadsSegment = url.pathname.split("/uploads/")[1];
      if (!uploadsSegment) {
        return "";
      }

      return decodeImageNameSafely(uploadsSegment).replace(/^uploads\//, "");
    } catch (error) {
      return "";
    }
  }

  const extractedImageName =
    image.split("/uploads/").pop()?.replace(/^uploads\//, "") || "";

  return decodeImageNameSafely(extractedImageName);
};

export const buildUploadUrl = (value, baseUrl = API_BASE_URL) => {
  if (!value) return "";

  const image = String(value).trim();
  if (!image) return "";

  if (image.startsWith("data:")) {
    return image;
  }

  const imageName = normalizeImageName(image);
  if (!imageName) {
    return /^https?:\/\//i.test(image) ? image : "";
  }

  const encodedImageName = imageName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${baseUrl}/uploads/${encodedImageName}`;
};

export const buildUploadFallbackUrl = (value) => {
  return buildUploadUrl(value, PRODUCTION_API_BASE_URL);
};

export const applyImageFallback = (event, fallbackSrc) => {
  if (!fallbackSrc) return;

  const currentSrc = event.currentTarget.getAttribute("src") || "";
  if (currentSrc === fallbackSrc) return;

  event.currentTarget.setAttribute("src", fallbackSrc);
};
