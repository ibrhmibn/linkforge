// Gabungin class name, buang nilai falsy.
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Skor ala arcade: 000000
export function padScore(value, length = 6) {
  return String(value).padStart(length, "0");
}
