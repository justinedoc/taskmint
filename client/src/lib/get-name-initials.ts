export function getInitials(fullname: string) {
  return fullname
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");
}
