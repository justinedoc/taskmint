export function toPascalCase(input: string) {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function wordToPascalCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}