export function getBondRatingBand(score) {
  if (score >= 85) return "AAA";
  if (score >= 75) return "AA";
  if (score >= 65) return "A";
  if (score >= 55) return "BBB";
  if (score >= 45) return "BB";
  return "B / Junk";
}

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
