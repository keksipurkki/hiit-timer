import * as React from "react";
import { formattedDuration, colorWheel } from "./utils";

interface Props extends IWorkout {
}

const ThankYou: React.FC = () => {
  return (
    <div className="tc">
      <h2>Congratulations!</h2>
      <p>
        <a href="/">Next workout?</a>
      </p>
      <small>
        Brought to your by <a href="https://github.com/keksipurkki">keksipurkki</a>
      </small>
    </div>
  );
};

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

function makeIntervals(params: IWorkout) {
  const intervals: IInterval[] = [];

  for (let set = 0; set < params.sets; set++) {
    intervals.push({
      remaining: params.rest,
      color: "#222",
      label: restLabel(set, params.sets - 1),
    });

    intervals.push({
      remaining: params.work,
      color: colorWheel[set % params.sets],
      label: `Round ${set + 1} / ${params.sets}`,
    });
  }
  return intervals;
}

const Interval: React.FC<IInterval> = props => {

  React.useEffect(() => {
    if (props.remaining === 0) {
      window.bluup();
    } else if (props.remaining <= 3000) {
      window.beep();
    }
  });

  return (
    <div className="tc">
      <h2 className="mv2">{formattedDuration(props.remaining)}</h2>
      <p className="mt2 mb5">{props.label}</p>
    </div>
  );
};

const Workout: React.FC<Props> = props => {

  const [intervals, setIntervals] = React.useState(makeIntervals(props));
  const [paused, setPaused] = React.useState(false);
  const [current, ...left] = intervals;

  if (!current) {

    React.useEffect(() => {
      document.body.style.backgroundColor = "#222";
    });

    React.useEffect(() => {
      const timer = window.setTimeout(console.log, 0, "Workout complete!");
      return window.clearTimeout.bind(window, timer);
    });

    return <ThankYou />;

  } else {

    React.useEffect(() => {
      document.body.style.backgroundColor = current.color;
    });

    React.useEffect(() => {

      if (paused) {
        return;
      }

      let args = [];

      if (current.remaining > 0) {
        const remaining = current.remaining - 1000;
        args.push([{ ...current, remaining }, ...left]);
      } else {
        args.push(left);
      }

      const timer = window.setTimeout(setIntervals, 1000, ...args);
      return window.clearTimeout.bind(window, timer);

    }, [current.remaining, paused]);

    const stop = () => window.location.href = "/";
    const togglePaused = () => setPaused(!paused);

    return (
      <>
        <Interval {...current} />
        <section className="flex">
          <button onClick={togglePaused} className="mh3">{paused ? "Resume" : "Pause"}</button>
          <button onClick={stop} className="mh3">Stop</button>
        </section>
      </>
    );
  }
};

export default Workout;
