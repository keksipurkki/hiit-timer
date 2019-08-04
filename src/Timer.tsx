import * as React from "react";
import Workout from "./Workout";
import { formattedDuration } from "./utils";

type Consumer<T> = (t: T) => void;
function effects<T>(...fns: Consumer<T>[]) {
  return (x: T) => () => {
    return fns.filter(Boolean).map(f => f(x));
  };
}


const nullOnChange = (x: number) => {};

interface StepperProps {
  label: string;
  value: any;
  decrement(): void;
  increment(): void;
}

const Stepper: React.FC<StepperProps> = ({ value, label, decrement, increment }) => {
  return (
    <form>
      <label className="mr3">{label}</label>
      <button type="button" onClick={decrement}>
        −
      </button>
      <input readOnly value={value} />
      <button type="button" onClick={increment}>
        +
      </button>
    </form>
  );
};

Stepper.defaultProps = {
  label: "Label",
  decrement: () => null,
  increment: () => null,
  value: 0,
};

function IntegerStepper({ onChange = nullOnChange, value = 20, label = "Label" } = {}) {
  const step = 1;
  const next = Math.min(value + step, 40);
  const prev = Math.max(value - step, 0);
  return (
    <Stepper
      label={label}
      increment={onChange.bind(undefined, next)}
      decrement={onChange.bind(undefined, prev)}
      value={value}
    />
  );
}

function TimeStepper({ onChange = nullOnChange, value = 0, label = "Label" } = {}) {
  const step = 1000; // millis
  const displayValue = formattedDuration(value);
  const next = Math.min(value + step, 60 * 1000);
  const prev = Math.max(value - step, 5 * 1000);
  return (
    <Stepper
      label={label}
      increment={onChange.bind(undefined, next)}
      decrement={onChange.bind(undefined, prev)}
      value={displayValue}
    />
  );
}

// Hackish solution to make browsers autoplay the sound effects
// Audio autoplay requires some user interaction, the Go! button provides it
function registerBeeps() {

  const jingles = {
    beep: new Audio("beep.mp3"),
    bluup: new Audio("bluup.mp3")
  };

  window.beep = () => {
    jingles.beep.load();
    jingles.beep.play();
  };

  window.bluup = () => {
    jingles.bluup.load();
    jingles.bluup.play();
  }

}

function Timer() {
  const defaults: IWorkout = {
    sets: 3,
    work: 30 * 1000,
    rest: 15 * 1000,
    start: false,
  };

  const [workout, setWorkout] = React.useState({ ...defaults });
  const setSets = (sets: number) => setWorkout({ ...workout, sets });
  const setWork = (work: number) => setWorkout({ ...workout, work });
  const setRest = (rest: number) => setWorkout({ ...workout, rest });

  const reset = () => setWorkout(defaults);
  const start = effects(setWorkout, registerBeeps)({ ...workout, start: true });

  if (workout.start) {
    return (
      <main className="flex flex-column justify-center">
        <div className="flex flex-column center mv5">
          <Workout {...workout} />
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex flex-column justify-center">
        <div className="flex flex-column center mv5">
          <section className="flex flex-column mv3">
            <IntegerStepper onChange={setSets} label="Sets" value={workout.sets} />
            <TimeStepper onChange={setWork} label="Work" value={workout.work} />
            <TimeStepper onChange={setRest} label="Rest" value={workout.rest} />
          </section>
          <section className="mv3 flex">
            <button onClick={reset} className="mh3">
              Reset
            </button>
            <button onClick={start} className="mh3">
              Go!
            </button>
          </section>
        </div>
      </main>
    );
  }
}

export default Timer;
