import * as React from "react";
import AppShell from "./AppShell";
import Workout from "./Workout";
import Timer from "./Timer";
import { effects, defaultWorkout } from "./utils";

function makeWorkout(defaults: WorkoutProps) {
  const [workout, setWorkout] = React.useState(() => defaults);

  const timer = {
    setSets: (sets: number) => setWorkout({ ...workout, sets }),
    setWork: (work: number) => setWorkout({ ...workout, work }),
    setRest: (rest: number) => setWorkout({ ...workout, rest }),
    start: () => effects(Workout.start, setWorkout)({ ...workout, start: true }),
    reset: (): void => setWorkout(defaultWorkout),
  };

  return { workout, timer };
}

const App: React.FC = () => {
  const { workout, timer } = makeWorkout(defaultWorkout);
  return (
    <AppShell>
      {workout.start ? <Workout {...workout} /> : <Timer workout={workout} {...timer} />}
    </AppShell>
  );
};

export default App;
