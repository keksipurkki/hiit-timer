(function (React, ReactDOM) {
    'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);
    var ReactDOM__namespace = /*#__PURE__*/_interopNamespaceDefault(ReactDOM);

    function info() {
        window.alert("For best results, add this app to your home screen.");
    }
    const AppShell = ({ children }) => (React__namespace.createElement(React__namespace.Fragment, null,
        React__namespace.createElement("header", { className: "h3 flex items-center" },
            React__namespace.createElement("img", { className: "mh2", width: "32", height: "32", src: "icons/icon-header.png" }),
            React__namespace.createElement("a", { href: "/" },
                React__namespace.createElement("h3", { className: "underline" }, document.title)),
            React__namespace.createElement("div", { className: "ml-auto" },
                React__namespace.createElement("a", { id: "install", onClick: info }))),
        React__namespace.createElement("main", { className: "flex flex-column justify-center" },
            React__namespace.createElement("div", { className: "flex flex-column center mv5" }, children))));

    const defaultWorkout = {
        sets: 20,
        work: 30 * 1000,
        rest: 15 * 1000,
        start: false,
    };
    const colorWheel = ["#cb4b16", "#dc322f", "#d33682", "#6c71c4"];
    function formattedDuration(millis) {
        const [, duration] = new Date(millis).toISOString().split("T");
        return duration.substr(4, 4);
    }
    function effects(...fns) {
        return (x) => {
            const cancels = fns.map(f => f(x));
            return () => { cancels.map(c => c && c()); };
        };
    }

    function backgroundEffect([interval]) {
        document.body.style.backgroundColor = interval.color;
    }
    function tickEffect([interval, setInterval]) {
        const timeout = 1000; // millis
        const { remaining, next } = interval;
        const updated = remaining > 0 ? { ...interval, remaining: remaining - timeout } : next;
        const timer = window.setTimeout(setInterval, timeout, updated);
        return () => window.clearTimeout(timer);
    }
    function soundEffect([interval]) {
        const { remaining } = interval;
        window.HiitTimer.soundEffects(remaining);
    }
    const effect = effects(tickEffect, soundEffect, backgroundEffect);
    function makeInterval(props, total) {
        const { sets, ...rest } = props;
        if (sets <= 0) {
            return null;
        }
        const next = makeInterval({
            ...rest,
            sets: sets - 1,
        }, total);
        return {
            label: `Rest`,
            subLabel: `Round ${total - sets + 1} coming up`,
            color: "#222",
            paused: false,
            remaining: props.rest,
            next: {
                label: `Round ${total - sets + 1} / ${total}`,
                subLabel: `Work work work!`,
                paused: false,
                remaining: props.work,
                color: colorWheel[sets % colorWheel.length],
                next,
            },
        };
    }
    function makeIntervals(props) {
        const total = props.sets;
        const [interval, setInterval] = React__namespace.useState(() => makeInterval(props, total));
        React__namespace.useEffect(() => {
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
    const Workout = (props) => {
        const { togglePause, interval } = makeIntervals(props);
        if (interval) {
            return (React__namespace.createElement(React__namespace.Fragment, null,
                React__namespace.createElement("div", { className: "tc" },
                    React__namespace.createElement("h2", { className: "mv2" }, formattedDuration(interval.remaining)),
                    React__namespace.createElement("p", { className: "m0", style: { lineHeight: "0" } }, interval.label),
                    React__namespace.createElement("small", { className: "db" }, interval.subLabel || React__namespace.createElement(React__namespace.Fragment, null, "\u00A0"))),
                React__namespace.createElement("section", { className: "flex mv4" },
                    React__namespace.createElement("button", { onClick: togglePause, className: "mh3" }, interval.paused ? "Resume" : "Pause"),
                    React__namespace.createElement("button", { onClick: Workout.stop, className: "mh3" }, "Stop"))));
        }
        else {
            return (React__namespace.createElement("div", { className: "tc" },
                React__namespace.createElement("h2", null, "Congratulations!"),
                React__namespace.createElement("p", null,
                    React__namespace.createElement("a", { href: "/" }, "Next workout?")),
                React__namespace.createElement("small", null,
                    "Brought to your by",
                    " ",
                    React__namespace.createElement("a", { href: "https://github.com/keksipurkki" }, "keksipurkki"))));
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
        const play = (audio) => {
            audio.play();
            audio.addEventListener("ended", audio.load.bind(audio));
        };
        const HiitTimer = {
            soundEffects: (millis) => {
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

    function useLongPress(effect, ms = 100) {
        const [startLongPress, setStartLongPress] = React__namespace.useState(false);
        React__namespace.useEffect(() => {
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
        if (!format)
            throw new Error("invalid_state");
        const decrementHandlers = useLongPress(() => onChange(decrement(value)));
        const incrementHandlers = useLongPress(() => onChange(increment(value)));
        return (React__namespace.createElement("form", { className: "noselect" },
            React__namespace.createElement("label", { className: "mr3 w3 dib" }, label),
            React__namespace.createElement("button", { type: "button", ...decrementHandlers }, "\u2212"),
            React__namespace.createElement("input", { type: "text", readOnly: true, value: format(value) }),
            React__namespace.createElement("button", { type: "button", ...incrementHandlers }, "+")));
    };
    Stepper.defaultProps = {
        label: "Label",
        decrement: (v) => v - 1,
        increment: (v) => v + 1,
        format: (v) => String(v),
        value: 0,
    };

    const nullOnChange = (_x) => { };
    function IntegerStepper({ value = 0, onChange = nullOnChange, label = "Label" } = {}) {
        const step = 1; // rounds
        const increment = (value) => Math.min(value + step, 40);
        const decrement = (value) => Math.max(value - step, 1);
        return (React__namespace.createElement(Stepper, { onChange: onChange, label: label, value: value, increment: increment, decrement: decrement }));
    }
    function TimeStepper({ value = 0, onChange = nullOnChange, label = "Label" } = {}) {
        const step = 1000; // millis
        const next = (value) => Math.min(value + step, 60 * 1000);
        const prev = (value) => Math.max(value - step, 5 * 1000);
        return (React__namespace.createElement(Stepper, { onChange: onChange, value: value, label: label, increment: next, decrement: prev, format: formattedDuration }));
    }
    const Timer = ({ start, reset, setSets, setWork, setRest, workout }) => {
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement("section", { className: "flex flex-column mv3" },
                React__namespace.createElement(IntegerStepper, { onChange: setSets, label: "Sets", value: workout.sets }),
                React__namespace.createElement(TimeStepper, { onChange: setWork, label: "Work", value: workout.work }),
                React__namespace.createElement(TimeStepper, { onChange: setRest, label: "Rest", value: workout.rest })),
            React__namespace.createElement("section", { className: "mv3 flex" },
                React__namespace.createElement("button", { onClick: reset, className: "mh3" }, "Reset"),
                React__namespace.createElement("button", { onClick: start, className: "mh3" }, "Go!"))));
    };

    function makeWorkout(defaults) {
        const [workout, setWorkout] = React__namespace.useState(() => defaults);
        const timer = {
            setSets: (sets) => setWorkout({ ...workout, sets }),
            setWork: (work) => setWorkout({ ...workout, work }),
            setRest: (rest) => setWorkout({ ...workout, rest }),
            start: () => effects(Workout.start, setWorkout)({ ...workout, start: true }),
            reset: () => setWorkout(defaultWorkout),
        };
        return { workout, timer };
    }
    const App = () => {
        const { workout, timer } = makeWorkout(defaultWorkout);
        return (React__namespace.createElement(AppShell, null, workout.start ? React__namespace.createElement(Workout, { ...workout }) : React__namespace.createElement(Timer, { workout: workout, ...timer })));
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
    const root = ReactDOM__namespace.createRoot(document.getElementById("app"));
    root.render(React__namespace.createElement(App, null));

})(React, ReactDOM);
//# sourceMappingURL=app.js.map
