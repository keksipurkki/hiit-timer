type Nullable<T> = T | null;
type Consumer<T> = (t: T) => void;
type Effect = () => void;

interface IWorkout {
  sets: number;
  work: number; // millis
  rest: number; // millis
  start: boolean;
}

interface IWorkoutTimer {
  workout: IWorkout;
  setSets(sets: number): void;
  setWork(sets: number): void;
  setRest(sets: number): void;
  start(): void;
  reset(): void;
}

interface IInterval {
  label: string;
  remaining: number;
  color: string;
}

// Patch windows object
interface Window { 
  NoSleep: any; 
}
