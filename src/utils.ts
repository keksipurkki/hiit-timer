export const defaultWorkout: WorkoutProps = {
  sets: 20,
  work: 30 * 1000,
  rest: 15 * 1000,
  start: false,
};


export function restLabel(set: number, last: number) {
  switch (set) {
    case 0:
      return "Get ready!";
    case last:
      return "Last round coming up!";
    default:
      return "Rest";
  }
}

export const colorWheel = ["#cb4b16", "#dc322f", "#d33682", "#6c71c4"];

export function formattedDuration(millis: number) {
  const [, duration] = new Date(millis).toISOString().split("T");
  return duration.substr(4, 4);
}

export function effects<T>(...fns: ConsumerEffect<T>[]) {
  return (x: T) => {
    const cancels = fns.map(f => f(x));
    return () => { cancels.map(c => c && c()); };
  };
}

export function sleep(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

