import * as React from "react";

export {};

declare global {
  interface ReactComponent<P = object> extends React.FC<React.PropsWithChildren<P>> {}
}
