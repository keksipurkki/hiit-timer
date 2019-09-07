import * as React from "react";

interface Props<V = number> {
  label: string;
  value: V;
  onChange(v: V): void;
  decrement(v: V): V;
  increment(v: V): V;
  format?(v: V): string;
}

function useLongPress(effect: Effect, ms = 100) {
  const [startLongPress, setStartLongPress] = React.useState(false);

  React.useEffect(() => {
    let timerId = undefined;

    if (startLongPress) {
      timerId = window.setTimeout(effect, ms);
    } else {
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

const Stepper: React.FC<Props> = ({ onChange, format, value, label, decrement, increment }) => {
  if (!format) throw new Error("invalid_state");

  const decrementHandlers = useLongPress(() => onChange(decrement(value)));
  const incrementHandlers = useLongPress(() => onChange(increment(value)));

  return (
    <form className="noselect">
      <label className="mr3 w3 dib">{label}</label>
      <button type="button" {...decrementHandlers}>
        −
      </button>
      <input type="text" readOnly value={format(value)} />
      <button type="button" {...incrementHandlers}>
        +
      </button>
    </form>
  );
};

Stepper.defaultProps = {
  label: "Label",
  decrement: (v: number) => v - 1,
  increment: (v: number) => v + 1,
  format: (v: number) => String(v),
  value: 0,
};

export default Stepper;
