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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

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
        const updated = remaining > 0 ? Object.assign(Object.assign({}, interval), { remaining: remaining - timeout }) : next;
        const timer = window.setTimeout(setInterval, timeout, updated);
        return () => window.clearTimeout(timer);
    }
    function soundEffect([interval]) {
        const { remaining } = interval;
        window.HiitTimer.soundEffects(remaining);
    }
    const effect = effects(tickEffect, soundEffect, backgroundEffect);
    function makeInterval(props, total) {
        const { sets } = props, rest = __rest(props, ["sets"]);
        if (sets <= 0) {
            return null;
        }
        const next = makeInterval(Object.assign(Object.assign({}, rest), { sets: sets - 1 }), total);
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
    function makeIntervals(props) {
        const total = props.sets;
        const [interval, setInterval] = React.useState(() => makeInterval(props, total));
        React.useEffect(() => {
            if (interval && !interval.paused) {
                return effect([interval, setInterval]);
            }
        });
        const togglePause = () => {
            if (interval) {
                setInterval(Object.assign(Object.assign({}, interval), { paused: !interval.paused }));
            }
        };
        return {
            togglePause,
            interval,
        };
    }
    const Workout = props => {
        const { togglePause, interval } = makeIntervals(props);
        if (interval) {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "tc" },
                    React.createElement("h2", { className: "mv2" }, formattedDuration(interval.remaining)),
                    React.createElement("p", { className: "mt2 mb5" }, interval.label)),
                React.createElement("section", { className: "flex" },
                    React.createElement("button", { onClick: togglePause, className: "mh3" }, interval.paused ? "Resume" : "Pause"),
                    React.createElement("button", { onClick: Workout.stop, className: "mh3" }, "Stop"))));
        }
        else {
            return (React.createElement("div", { className: "tc" },
                React.createElement("h2", null, "Congratulations!"),
                React.createElement("p", null,
                    React.createElement("a", { href: "/" }, "Next workout?")),
                React.createElement("small", null,
                    "Brought to your by ",
                    React.createElement("a", { href: "https://github.com/keksipurkki" }, "keksipurkki"))));
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
        if (!format)
            throw new Error("invalid_state");
        const decrementHandlers = useLongPress(() => onChange(decrement(value)));
        const incrementHandlers = useLongPress(() => onChange(increment(value)));
        return (React.createElement("form", { className: "noselect" },
            React.createElement("label", { className: "mr3 w3 dib" }, label),
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

    const nullOnChange = (_x) => { };
    function IntegerStepper({ value = 0, onChange = nullOnChange, label = "Label" } = {}) {
        const step = 1; // rounds
        const increment = (value) => Math.min(value + step, 40);
        const decrement = (value) => Math.max(value - step, 1);
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
                React.createElement("button", { onClick: start, className: "mh3" }, "Go!"))));
    };

    function makeWorkout(defaults) {
        const [workout, setWorkout] = React.useState(() => defaults);
        const timer = {
            setSets: (sets) => setWorkout(Object.assign(Object.assign({}, workout), { sets })),
            setWork: (work) => setWorkout(Object.assign(Object.assign({}, workout), { work })),
            setRest: (rest) => setWorkout(Object.assign(Object.assign({}, workout), { rest })),
            start: () => effects(Workout.start, setWorkout)(Object.assign(Object.assign({}, workout), { start: true })),
            reset: () => setWorkout(defaultWorkout),
        };
        return { workout, timer };
    }
    const App = () => {
        const { workout, timer } = makeWorkout(defaultWorkout);
        return (React.createElement(AppShell, null, workout.start ? React.createElement(Workout, Object.assign({}, workout)) : React.createElement(Timer, Object.assign({ workout: workout }, timer))));
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
    ReactDOM.render(React.createElement(App, null), document.getElementById("app"));

}(React, ReactDOM));
//# sourceMappingURL=app.js.map
