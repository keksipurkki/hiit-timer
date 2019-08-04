export function formattedDuration(millis: number) {
  const [, duration] = new Date(millis).toISOString().split("T");
  return duration.substr(4, 4);
}

export const colorWheel = [
  "#cb4b16",
  "#dc322f",
  "#d33682",
  "#6c71c4"
];

