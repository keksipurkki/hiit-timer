function restLabel(set: number, last: number) {
  switch (set) {
    case 0:
      return "Get ready!";
    case last:
      return "Last round coming up!";
    default:
      return "Rest";
  }
}

const colorWheel = [
  "#cb4b16",
  "#dc322f",
  "#d33682",
  "#6c71c4"
];

export function formattedDuration(millis: number) {
  const [, duration] = new Date(millis).toISOString().split("T");
  return duration.substr(4, 4);
}

export function effects<T>(...fns: Consumer<T>[]) {
  return (x: T) => {
    return fns.filter(Boolean).map(f => f(x));
  };
}

export function sleep(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export function makeIntervals(params: IWorkout) {

  const intervals: IInterval[] = [];

  for (let set = 0; set < params.sets; set++) {

    intervals.push({
      remaining: params.rest,
      color: "#222",
      label: restLabel(set, params.sets - 1),
    });

    intervals.push({
      remaining: params.work,
      color: colorWheel[set % colorWheel.length],
      label: `Round ${set + 1} / ${params.sets}`,
    });

  }

  return intervals;

}
