(function (React, ReactDOM) {
  'use strict';

  function info() {
      window.alert("For best results, add this app to your home screen.");
  }
  const AppShell = ({ children }) => (React.createElement(React.Fragment, null,
      React.createElement("header", { className: "h3 flex items-center" },
          React.createElement("img", { className: "mh2", width: "32", height: "32", src: "icons/icon-header.png" }),
          React.createElement("a", { href: "/" },
              React.createElement("h3", { className: "underline" }, document.title)),
          React.createElement("div", { className: "ml-auto" },
              React.createElement("a", { id: "install", onClick: info }))),
      React.createElement("main", { className: "flex flex-column justify-center" },
          React.createElement("div", { className: "flex flex-column center mv5" }, children))));
  //# sourceMappingURL=AppShell.js.map

  function restLabel(set, last) {
      switch (set) {
          case 0:
              return "Get ready!";
          case last:
              return "Last round coming up!";
          default:
              return "Rest";
      }
  }
  const colorWheel = [
      "#cb4b16",
      "#dc322f",
      "#d33682",
      "#6c71c4"
  ];
  function formattedDuration(millis) {
      const [, duration] = new Date(millis).toISOString().split("T");
      return duration.substr(4, 4);
  }
  function effects(...fns) {
      return (x) => {
          return fns.filter(Boolean).map(f => f(x));
      };
  }
  function makeIntervals(params) {
      const intervals = [];
      for (let set = 0; set < params.sets; set++) {
          intervals.push({
              remaining: params.rest,
              color: "#222",
              label: restLabel(set, params.sets - 1),
          });
          intervals.push({
              remaining: params.work,
              color: colorWheel[set % colorWheel.length],
              label: `Round ${set + 1} / ${params.sets}`,
          });
      }
      return intervals;
  }
  //# sourceMappingURL=utils.js.map

  let countDownSoundEffect = (seconds) => { };
  function tick(current) {
      const remaining = current.remaining - 1000;
      if (remaining < 0) {
          return null;
      }
      return Object.assign({}, current, { remaining });
  }
  const ThankYou = () => {
      return (React.createElement("div", { className: "tc" },
          React.createElement("h2", null, "Congratulations!"),
          React.createElement("p", null,
              React.createElement("a", { href: "/" }, "Next workout?")),
          React.createElement("small", null,
              "Brought to your by ",
              React.createElement("a", { href: "https://github.com/keksipurkki" }, "keksipurkki"))));
  };
  const Interval = props => {
      React.useEffect(() => {
          countDownSoundEffect(Math.floor(props.remaining / 1000));
      });
      return (React.createElement("div", { className: "tc" },
          React.createElement("h2", { className: "mv2" }, formattedDuration(props.remaining)),
          React.createElement("p", { className: "mt2 mb5" }, props.label)));
  };
  const Workout = props => {
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
          }
          else {
              timer = window.setTimeout(console.log, 0, "Workout complete!");
          }
          return window.clearTimeout.bind(window, timer);
      }, [paused, current]);
      return current ? (React.createElement(React.Fragment, null,
          React.createElement(Interval, Object.assign({}, current)),
          React.createElement("section", { className: "flex" },
              React.createElement("button", { onClick: togglePaused, className: "mh3" }, paused ? "Resume" : "Pause"),
              React.createElement("button", { onClick: Workout.stop, className: "mh3" }, "Stop")))) : (React.createElement(ThankYou, null));
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

  function useLongPress(effect, ms = 100) {
      const [startLongPress, setStartLongPress] = React.useState(false);
      React.useEffect(() => {
          let timerId = undefined;
          if (startLongPress) {
              timerId = window.setTimeout(effect, ms);
          }
          else {
              window.clearTimeout(timerId);
          }
          return window.clearTimeout.bind(window, timerId);
      });
      return {
          onClick: () => effect(),
          onMouseDown: () => setStartLongPress(true),
          onMouseUp: () => setStartLongPress(false),
          onMouseLeave: () => setStartLongPress(false),
          onTouchStart: () => setStartLongPress(true),
          onTouchEnd: () => setStartLongPress(false),
      };
  }
  const Stepper = ({ onChange, format, value, label, decrement, increment }) => {
      const decrementHandlers = useLongPress(() => onChange(decrement(value)));
      const incrementHandlers = useLongPress(() => onChange(increment(value)));
      return (React.createElement("form", { className: "noselect" },
          React.createElement("label", { className: "mr3" }, label),
          React.createElement("button", Object.assign({ type: "button" }, decrementHandlers), "\u2212"),
          React.createElement("input", { type: "text", readOnly: true, value: format(value) }),
          React.createElement("button", Object.assign({ type: "button" }, incrementHandlers), "+")));
  };
  Stepper.defaultProps = {
      label: "Label",
      decrement: (v) => v - 1,
      increment: (v) => v + 1,
      format: (v) => String(v),
      value: 0,
  };
  //# sourceMappingURL=Stepper.js.map

  const nullOnChange = (x) => { };
  function IntegerStepper({ value = 0, onChange = nullOnChange, label = "Label" } = {}) {
      const step = 1; // rounds
      const increment = (value) => Math.min(value + step, 40);
      const decrement = (value) => Math.max(value - step, 0);
      return (React.createElement(Stepper, { onChange: onChange, label: label, value: value, increment: increment, decrement: decrement }));
  }
  function TimeStepper({ value = 0, onChange = nullOnChange, label = "Label" } = {}) {
      const step = 1000; // millis
      const next = (value) => Math.min(value + step, 60 * 1000);
      const prev = (value) => Math.max(value - step, 5 * 1000);
      return (React.createElement(Stepper, { onChange: onChange, value: value, label: label, increment: next, decrement: prev, format: formattedDuration }));
  }
  const Timer = ({ start, reset, setSets, setWork, setRest, workout }) => {
      return (React.createElement(React.Fragment, null,
          React.createElement("section", { className: "flex flex-column mv3" },
              React.createElement(IntegerStepper, { onChange: setSets, label: "Sets", value: workout.sets }),
              React.createElement(TimeStepper, { onChange: setWork, label: "Work", value: workout.work }),
              React.createElement(TimeStepper, { onChange: setRest, label: "Rest", value: workout.rest })),
          React.createElement("section", { className: "mv3 flex" },
              React.createElement("button", { onClick: reset, className: "mh3" }, "Reset"),
              React.createElement("button", { onClick: effects(Workout.start, start).bind(undefined, workout), className: "mh3" }, "Go!"))));
  };
  //# sourceMappingURL=Timer.js.map

  const defaultWorkout = {
      sets: 20,
      work: 30 * 1000,
      rest: 15 * 1000,
      start: false,
  };
  const App = () => {
      const [workout, setWorkout] = React.useState(Object.assign({}, defaultWorkout));
      const timer = {
          setSets: (sets) => setWorkout(Object.assign({}, workout, { sets })),
          setWork: (work) => setWorkout(Object.assign({}, workout, { work })),
          setRest: (rest) => setWorkout(Object.assign({}, workout, { rest })),
          start: () => setWorkout(Object.assign({}, workout, { start: true })),
          reset: () => setWorkout(defaultWorkout)
      };
      let Content = null;
      if (workout.start) {
          Content = React.createElement(Workout, Object.assign({}, workout));
      }
      else {
          Content = React.createElement(Timer, Object.assign({ workout: workout }, timer));
      }
      return React.createElement(AppShell, null, Content);
  };
  //# sourceMappingURL=App.js.map

  ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
  //# sourceMappingURL=index.js.map

}(React, ReactDOM));
//# sourceMappingURL=app.js.map
