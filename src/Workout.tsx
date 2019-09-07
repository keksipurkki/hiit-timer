import * as React from "react";
import { colorWheel, effects, formattedDuration } from "./utils";

type Props = WorkoutProps;

interface StaticProps {
  start(): void;
  stop(): void;
}

interface Intervals {
  togglePause(): void;
  interval: Nullable<IntervalProps>;
}

type IntervalTuple = [IntervalProps, Consumer<IntervalProps>];

function backgroundEffect([interval]: IntervalTuple) {
  document.body.style.backgroundColor = interval.color;
}

function tickEffect([interval, setInterval]: IntervalTuple) {
  const timeout = 1000; // millis
  const { remaining, next } = interval;
  const updated = remaining > 0 ? { ...interval, remaining: remaining - timeout } : next;
  const timer = window.setTimeout(setInterval, timeout, updated);
  return () => window.clearTimeout(timer);
}

function soundEffect([interval]: IntervalTuple) {
  const { remaining } = interval;
  window.HiitTimer.soundEffects(remaining);
}

const effect = effects(tickEffect, soundEffect, backgroundEffect);

function makeInterval(props: WorkoutProps, total: number): Nullable<IntervalProps> {
  const { sets, ...rest } = props;

  if (sets <= 0) {
    return null;
  }

  const next = makeInterval(
    {
      ...rest,
      sets: sets - 1,
    },
    total
  );

  return {
    label: "Rest",
    color: "#222",
    paused: false,
    remaining: props.rest,
    next: {
      label: `Round ${total - sets + 1} / ${total}`,
      paused: false,
      remaining: props.work,
      color: colorWheel[sets % colorWheel.length],
      next,
    },
  };
}

function makeIntervals(props: WorkoutProps): Intervals {
  const total = props.sets;
  const [interval, setInterval] = React.useState(() => makeInterval(props, total));

  React.useEffect(() => {
    if (interval && !interval.paused) {
      return effect([interval, setInterval]);
    }
  });

  const togglePause = () => {
    if (interval) {
      setInterval({ ...interval, paused: !interval.paused });
    }
  };

  return {
    togglePause,
    interval,
  };

}

const Workout: React.FC<Props> & StaticProps = props => {
  const { togglePause, interval } = makeIntervals(props);
  if (interval) {
    return (
      <>
        <div className="tc">
          <h2 className="mv2">{formattedDuration(interval.remaining)}</h2>
          <p className="mt2 mb5">{interval.label}</p>
        </div>
        <section className="flex">
          <button onClick={togglePause} className="mh3">
            {interval.paused ? "Resume" : "Pause"}
          </button>
          <button onClick={Workout.stop} className="mh3">
            Stop
          </button>
        </section>
      </>
    );
  } else {
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
  }
};

Workout.start = () => {

  console.log("Assigning side effects to the workout");

  /* Prevent device from going to standby */
  if (NoSleep) {
    new NoSleep().enable();
  }

  /* Register sound effects. NB: Audio playback requires an user interaction */
  const sndEffects = {
    beep3: new Audio("snd/beep3.mp3"),
    beep2: new Audio("snd/beep2.mp3"),
    beep1: new Audio("snd/beep1.mp3"),
    beep0: new Audio("snd/beep0.mp3"),
  };

  const play = (audio: HTMLMediaElement) => {
    audio.play();
    audio.addEventListener("ended", audio.load.bind(audio));
  };

  const HiitTimer = {
    soundEffects: (millis: number) => {
      switch (millis) {
        case 3000:
          return play(sndEffects.beep3);
        case 2000:
          return play(sndEffects.beep2);
        case 1000:
          return play(sndEffects.beep1);
        case 0:
          return play(sndEffects.beep0);
        default:
          return;
      }
    },
  };

  window.HiitTimer = HiitTimer;

};

Workout.stop = () => (window.location.href = "/");

export default Workout;
