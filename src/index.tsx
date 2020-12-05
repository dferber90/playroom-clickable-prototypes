import * as React from "react";

/*
  Usage

  <Prototype active="start">
    <Frame id="start">
      <Trigger target="start" action="click, hovering, pressing, mouseEnter, mouseLeave">

      </Trigger>
    </Frame>
  </Prototype>
*/

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

// https://usehooks.com/usePrevious/
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const useEscapeTwice = (onTwice) => {
  const latency = 300;
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (count === 2) {
      onTwice();
      setCount(0);
    }
  }, [count]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCount(0);
    }, latency);

    const handleClick = () => {
      setCount((prev) => prev + 1);
    };

    document.addEventListener("keydown", handleClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleClick);
    };
  }, [count]);
};

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

type PrototypeContextType = {
  frame: string;
  setFrame: (frame: string) => void;
  highlighted: boolean;
  setHighlighted: (highlighted: boolean) => void;
};

const PrototypeContext = React.createContext<PrototypeContextType>({
  frame: "",
  setFrame: () => {},
  highlighted: false,
  setHighlighted: () => {},
});

// -----------------------------------------------------------------------------
// Prototype
// -----------------------------------------------------------------------------

interface PrototypeProps {
  active?: string;
}

export const Prototype: React.FC<PrototypeProps> = (props) => {
  const initiallyActiveFrame = props.active ? props.active : "";
  const [frame, setFrame] = React.useState<string>(initiallyActiveFrame);
  const [highlighted, setHighlighted] = React.useState<boolean>(false);
  const prevActiveProp = usePrevious(initiallyActiveFrame);

  const prototypeContext = React.useMemo(
    () => ({ frame, setFrame, highlighted, setHighlighted }),
    [frame, setFrame, highlighted, setHighlighted]
  );

  // update active frame if initial value changes
  React.useEffect(() => {
    if (props.active !== prevActiveProp) {
      console.log("active check resets");
      setFrame(props.active);
    }
  }, [props.active, prevActiveProp]);

  // allow reset by pressing escape thrice
  const handleEscapeTwice = React.useCallback(() => {
    setHighlighted(true);
  }, [setHighlighted]);
  useEscapeTwice(handleEscapeTwice);

  React.useEffect(() => {
    if (!highlighted) return;

    const handleClick = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setHighlighted(false);
      setFrame(initiallyActiveFrame);
    };

    document.addEventListener("keydown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleClick);
    };
  }, [highlighted]);

  // reset highlighted state
  React.useEffect(() => {
    if (!highlighted) return;

    const listener = () => {
      setHighlighted(false);
    };

    document.addEventListener("click", listener);
    document.addEventListener("mousemove", listener);
    return () => {
      document.removeEventListener("click", listener);
      document.removeEventListener("mousemove", listener);
    };
  }, [highlighted, setHighlighted]);

  return (
    <PrototypeContext.Provider value={prototypeContext}>
      {props.children}
    </PrototypeContext.Provider>
  );
};

Prototype.defaultProps = { active: "" };

// -----------------------------------------------------------------------------
// Frame
// -----------------------------------------------------------------------------

interface FrameProps {
  id: string;
  children: React.ReactElement;
}

export const Frame: React.FC<FrameProps> = (props) => {
  const prototypeContext = React.useContext(PrototypeContext);
  return prototypeContext.frame === props.id ? props.children : null;
};

Frame.defaultProps = { id: "" };

// -----------------------------------------------------------------------------
// Trigger
// -----------------------------------------------------------------------------
interface TriggerProps {
  target: string;
  children: React.ReactElement;
}

export const Trigger: React.FC<TriggerProps> = (props) => {
  const prototypeContext = React.useContext(PrototypeContext);
  return (
    <div
      onClick={() => prototypeContext.setFrame(props.target)}
      style={{
        display: "inline-block",
        outline: prototypeContext.highlighted ? "2px solid #AF8638" : "",
      }}
    >
      {props.children}
    </div>
  );
};

Trigger.defaultProps = { target: "" };
