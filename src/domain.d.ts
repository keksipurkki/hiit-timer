interface IWorkout {
  sets: number;
  work: number; // millis
  rest: number; // millis
  start: boolean;
}

interface IInterval {
  label: string;
  remaining: number;
  color: string;
}
