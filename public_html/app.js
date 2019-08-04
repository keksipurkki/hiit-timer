(function (React, ReactDOM) {
  'use strict';

  function formattedDuration(millis) {
      const [, duration] = new Date(millis).toISOString().split("T");
      return duration.substr(4, 4);
  }
  const colorWheel = [
      "#cb4b16",
      "#dc322f",
      "#d33682",
      "#6c71c4"
  ];
  //# sourceMappingURL=utils.js.map

  const ThankYou = () => {
      return (React.createElement("div", { className: "tc" },
          React.createElement("h2", null, "Congratulations!"),
          React.createElement("p", null,
              React.createElement("a", { href: "/" }, "Next workout?")),
          React.createElement("small", null,
              "Brought to your by ",
              React.createElement("a", { href: "https://github.com/keksipurkki" }, "keksipurkki"))));
  };
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
              color: colorWheel[set % params.sets],
              label: `Round ${set + 1} / ${params.sets}`,
          });
      }
      return intervals;
  }
  const Interval = props => {
      React.useEffect(() => {
          if (props.remaining === 0) {
              window.bluup();
          }
          else if (props.remaining <= 3000) {
              window.beep();
          }
      });
      return (React.createElement("div", { className: "tc" },
          React.createElement("h2", { className: "mv2" }, formattedDuration(props.remaining)),
          React.createElement("p", { className: "mt2 mb5" }, props.label)));
  };
  const Workout = props => {
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
          return React.createElement(ThankYou, null);
      }
      else {
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
                  args.push([Object.assign({}, current, { remaining }), ...left]);
              }
              else {
                  args.push(left);
              }
              const timer = window.setTimeout(setIntervals, 1000, ...args);
              return window.clearTimeout.bind(window, timer);
          }, [current.remaining, paused]);
          const stop = () => window.location.href = "/";
          const togglePaused = () => setPaused(!paused);
          return (React.createElement(React.Fragment, null,
              React.createElement(Interval, Object.assign({}, current)),
              React.createElement("section", { className: "flex" },
                  React.createElement("button", { onClick: togglePaused, className: "mh3" }, paused ? "Resume" : "Pause"),
                  React.createElement("button", { onClick: stop, className: "mh3" }, "Stop"))));
      }
  };
  //# sourceMappingURL=Workout.js.map

  function effects(...fns) {
      return (x) => () => {
          return fns.filter(Boolean).map(f => f(x));
      };
  }
  const nullOnChange = (x) => { };
  const Stepper = ({ value, label, decrement, increment }) => {
      return (React.createElement("form", null,
          React.createElement("label", { className: "mr3" }, label),
          React.createElement("button", { type: "button", onClick: decrement }, "\u2212"),
          React.createElement("input", { readOnly: true, value: value }),
          React.createElement("button", { type: "button", onClick: increment }, "+")));
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
      return (React.createElement(Stepper, { label: label, increment: onChange.bind(undefined, next), decrement: onChange.bind(undefined, prev), value: value }));
  }
  function TimeStepper({ onChange = nullOnChange, value = 0, label = "Label" } = {}) {
      const step = 1000; // millis
      const displayValue = formattedDuration(value);
      const next = Math.min(value + step, 60 * 1000);
      const prev = Math.max(value - step, 5 * 1000);
      return (React.createElement(Stepper, { label: label, increment: onChange.bind(undefined, next), decrement: onChange.bind(undefined, prev), value: displayValue }));
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
      };
  }
  // Another hack to disable the screen lock when the timer is running
  function disableSleep() {
      if (!NoSleep) {
          return;
      }
      new NoSleep().enable();
  }
  function Timer() {
      const defaults = {
          sets: 20,
          work: 30 * 1000,
          rest: 15 * 1000,
          start: false,
      };
      const [workout, setWorkout] = React.useState(Object.assign({}, defaults));
      const setSets = (sets) => setWorkout(Object.assign({}, workout, { sets }));
      const setWork = (work) => setWorkout(Object.assign({}, workout, { work }));
      const setRest = (rest) => setWorkout(Object.assign({}, workout, { rest }));
      const reset = () => setWorkout(defaults);
      const start = effects(setWorkout, registerBeeps, disableSleep)(Object.assign({}, workout, { start: true }));
      if (workout.start) {
          return (React.createElement("main", { className: "flex flex-column justify-center" },
              React.createElement("div", { className: "flex flex-column center mv5" },
                  React.createElement(Workout, Object.assign({}, workout)))));
      }
      else {
          return (React.createElement("main", { className: "flex flex-column justify-center" },
              React.createElement("div", { className: "flex flex-column center mv5" },
                  React.createElement("section", { className: "flex flex-column mv3" },
                      React.createElement(IntegerStepper, { onChange: setSets, label: "Sets", value: workout.sets }),
                      React.createElement(TimeStepper, { onChange: setWork, label: "Work", value: workout.work }),
                      React.createElement(TimeStepper, { onChange: setRest, label: "Rest", value: workout.rest })),
                  React.createElement("section", { className: "mv3 flex" },
                      React.createElement("button", { onClick: reset, className: "mh3" }, "Reset"),
                      React.createElement("button", { onClick: start, className: "mh3" }, "Go!")))));
      }
  }

  function info() {
      window.alert("For best results, add this app to your home screen.");
  }
  const App = () => {
      return (React.createElement(React.Fragment, null,
          React.createElement("header", { className: "h3 flex items-center" },
              React.createElement("img", { className: "mh2", width: "32", height: "32", src: "icons/icon-128x128.png" }),
              React.createElement("a", { href: "/" },
                  React.createElement("h3", { className: "underline" }, "L33t Timer")),
              React.createElement("div", { className: "ml-auto" },
                  React.createElement("a", { id: "install", onClick: info }))),
          React.createElement(Timer, null)));
  };
  ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
  //# sourceMappingURL=index.js.map

}(React, ReactDOM));
