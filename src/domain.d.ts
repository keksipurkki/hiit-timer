type Nullable<T> = T | null;
type Consumer<T> = (t: T) => void;
type Effect = () => void;
type ConsumerEffect<T> = (t: T) => void | Effect;

interface WorkoutProps {
  sets: number;
  work: number; // millis
  rest: number; // millis
  start: boolean;
}

interface TimerProps {
  workout: WorkoutProps;
  setSets(sets: number): void;
  setWork(sets: number): void;
  setRest(sets: number): void;
  start(): void;
  reset(): void;
}

interface IntervalProps {
  label: string;
  subLabel?: string;
  remaining: number;
  color: string;
  next: Nullable<IntervalProps>;
  paused: boolean;
}

interface HiitTimer {
  soundEffects(millis: number): void;
}

declare class NoSleep {
  constructor();
  enable(): void;
}

// Patch windows object
interface Window {
  HiitTimer: HiitTimer;
}
