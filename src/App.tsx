import * as React from "react";
import AppShell from "./AppShell";
import Workout from "./Workout";
import Timer from "./Timer";

const defaultWorkout: IWorkout = {
  sets: 20,
  work: 30 * 1000,
  rest: 15 * 1000,
  start: false,
};

const App: React.FC = () => {

  const [workout, setWorkout] = React.useState({ ...defaultWorkout });

  const timer = {
    setSets: (sets: number) => setWorkout({ ...workout, sets }),
    setWork: (work: number) => setWorkout({ ...workout, work }),
    setRest: (rest: number) => setWorkout({ ...workout, rest }),
    start: () => setWorkout({...workout, start: true }),
    reset: () => setWorkout(defaultWorkout)
  };

  let Content = null;

  if (workout.start) {
    Content = <Workout {...workout} />;
  } else {
    Content = <Timer workout={workout} {...timer} />
  }

  return <AppShell>{Content}</AppShell>;

};

export default App;
