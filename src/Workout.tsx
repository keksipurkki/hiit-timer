import * as React from "react";
import { makeIntervals, formattedDuration } from "./utils";

interface Props extends IWorkout {}

interface StaticProps {
  start(): void;
  stop(): void;
}

let countDownSoundEffect = (seconds: number) => {};

function tick(current: IInterval): Nullable<IInterval> {
  const remaining = current.remaining - 1000;

  if (remaining < 0) {
    return null;
  }

  return {
    ...current,
    remaining,
  };
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

const Interval: React.FC<IInterval> = props => {
  React.useEffect(() => {
    countDownSoundEffect(Math.floor(props.remaining / 1000));
  });

  return (
    <div className="tc">
      <h2 className="mv2">{formattedDuration(props.remaining)}</h2>
      <p className="mt2 mb5">{props.label}</p>
    </div>
  );
};

const Workout: React.FC<Props> & StaticProps = props => {
  const [intervals, setIntervals] = React.useState(makeIntervals(props));
  const [paused, setPaused] = React.useState(false);
  const [current, ...left] = intervals;
  const togglePaused = () => setPaused(!paused);

  React.useEffect(() => {
    document.body.style.backgroundColor = current ? current.color : "#222";
  });

  React.useEffect(() => {
    let timer = undefined;

    if (current) {
      const updated = tick(current);
      timer = window.setTimeout(setIntervals, 1000, [updated, ...left].filter(Boolean));
    } else {
      timer = window.setTimeout(console.log, 0, "Workout complete!");
    }

    return window.clearTimeout.bind(window, timer);
  }, [paused, current]);

  return current ? (
    <>
      <Interval {...current} />
      <section className="flex">
        <button onClick={togglePaused} className="mh3">
          {paused ? "Resume" : "Pause"}
        </button>
        <button onClick={Workout.stop} className="mh3">
          Stop
        </button>
      </section>
    </>
  ) : (
    <ThankYou />
  );
};

Workout.start = () => {
  console.log("Assigning side effects to the workout");

  /* Prevent device from going to standby */
  if (window.NoSleep) {
    new window.NoSleep().enable();
  }

  /* Register sound effects. NB: Audio playback requires an user interaction */

  window.SndEffects = {
    beep: new Audio("beep.mp3"),
    bebeep: new Audio("bluup.mp3")
  };

  const beep = () => {
    window.SndEffects.beep.load();
    window.SndEffects.beep.play();
  };

  const bebeep = () => {
    window.SndEffects.bebeep.load();
    window.SndEffects.bebeep.play();
  };

  countDownSoundEffect = seconds => {
    switch (seconds) {
      case 1:
      case 2:
      case 3:
        return beep();
      case 0:
        return bebeep();
    }
  };
};

Workout.stop = () => (window.location.href = "/");

export default Workout;
