import * as React from "react";
import { makeIntervals, formattedDuration } from "./utils";

interface Props extends IWorkout {}

interface StaticProps {
  start(): void;
  stop(): void;
}

let countDownSoundEffect: Consumer<number> = (millis: number) => {};

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

  if (current) {
    React.useEffect(() => {
      countDownSoundEffect(current.remaining);

      let timer = undefined;
      const updated = tick(current);
      const newIntervals = [updated, ...left].filter(Boolean);

      timer = window.setTimeout(setIntervals, 1000, newIntervals);
      return window.clearTimeout.bind(window, timer);
    }, [paused, current.remaining]);
  }

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
  const SndEffects = {
    beep3: new Audio("beep3.mp3"),
    beep2: new Audio("beep2.mp3"),
    beep1: new Audio("beep1.mp3"),
    bebeep: new Audio("bluup.mp3"),
  };

  const play = (audio: HTMLMediaElement) => {
    audio.play();
    audio.addEventListener("ended", () => audio.load());
  };

  countDownSoundEffect = (millis: number) => {
    switch (millis) {
      case 3000:
        return play(SndEffects.beep3);
      case 2000:
        return play(SndEffects.beep2);
      case 1000:
        return play(SndEffects.beep1);
      case 0:
        return play(SndEffects.bebeep);
      default:
        return;
    }
  };
};

Workout.stop = () => (window.location.href = "/");

export default Workout;
