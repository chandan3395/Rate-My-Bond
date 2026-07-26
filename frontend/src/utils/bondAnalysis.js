// Rating bands and scores are computed ONLY by the backend scoring engine.
// This module holds purely presentational helpers that map the backend's
// values to UI tones — it must not recompute any score or rating.
export function getBondRatingTone(rating) {
  switch (rating) {
    case "AAA":
      return "text-[#8fd7cf]";
    case "AA":
      return "text-[#b7ebe6]";
    case "A":
      return "text-[#d8f5f1]";
    case "BBB":
      return "text-[#f2e6aa]";
    case "BB":
      return "text-[#f4c98d]";
    default:
      return "text-[#f4a6a6]";
  }
}
