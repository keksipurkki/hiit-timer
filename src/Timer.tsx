import * as React from "react";
import Stepper from "./Stepper";
import { formattedDuration } from "./utils";
import Workout from "./Workout";
import { effects } from "./utils";

interface Props extends IWorkoutTimer {}

const nullOnChange = (x: number) => {};

function IntegerStepper({ value = 0, onChange = nullOnChange, label = "Label" } = {}) {
  const step = 1; // rounds
  const increment = (value: number) => Math.min(value + step, 40);
  const decrement = (value: number) => Math.max(value - step, 0);
  return (
    <Stepper
      onChange={onChange}
      label={label}
      value={value}
      increment={increment}
      decrement={decrement}
    />
  );
}

function TimeStepper({ value = 0, onChange = nullOnChange, label = "Label" } = {}) {
  const step = 1000; // millis
  const next = (value: number) => Math.min(value + step, 60 * 1000);
  const prev = (value: number) => Math.max(value - step, 5 * 1000);
  return (
    <Stepper
      onChange={onChange}
      value={value}
      label={label}
      increment={next}
      decrement={prev}
      format={formattedDuration}
    />
  );
}

const Timer: React.FC<Props> = ({ start, reset, setSets, setWork, setRest, workout }) => {
  return (
    <>
      <section className="flex flex-column mv3">
        <IntegerStepper onChange={setSets} label="Sets" value={workout.sets} />
        <TimeStepper onChange={setWork} label="Work" value={workout.work} />
        <TimeStepper onChange={setRest} label="Rest" value={workout.rest} />
      </section>
      <section className="mv3 flex">
        <button onClick={reset} className="mh3">
          Reset
        </button>
        <button onClick={effects(Workout.start, start).bind(undefined, workout)} className="mh3">
          Go!
        </button>
      </section>
    </>
  );
};

export default Timer;
