import * as React from "react";
import { render } from "react-dom";
import { default as emotionStyled } from "@emotion/styled";
import { default as scStyled } from "styled-components";
import { mergeStyles } from "@uifabric/merge-styles";
import { Provider, createComponent } from "react-fela";
import { styled as newStyled } from "./newStyled/styled";
import createRenderer from "./renderer";

const renderer = createRenderer();

const SCButton = scStyled.button`
  background: rgba(
    ${props => props.index % 225},
    128,
    ${props => 127 + (props.index % 127)},
    1
  );
`;

const EmotionButton = emotionStyled.button`
  background: rgba(
    ${props => props.index % 225},
    128,
    ${props => 127 + (props.index % 127)},
    1
  );
`;

const NewMSButton = newStyled("button")`
  background: rgba(${props => props.index % 225}, 128, ${props =>
  127 + (props.index % 127)}, 1);
`;

const msStyled = (ComponentType, styles) => props => (
  <ComponentType
    {...props}
    className={mergeStyles(
      typeof styles === "function" ? styles(props) : styles,
      props.className
    )}
  />
);

const styles = props => ({
  background: `rgba(
        ${props.index % 225},
         128,
        ${127 + (props.index % 127)},
         1
      )`
});

const MSButton = msStyled("button", styles);

const FelaButton = createComponent(styles, "button", {
  as: "button"
});

const useTimer = () => {
  const [isRunning, setRunning] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const [lastTime, setLastTime] = React.useState("(not run)");

  return [
    lastTime,
    isRunning,
    value => {
      if (value === true) {
        if (isRunning === false) {
          setTick(performance.now());
          setLastTime("Running");
          setRunning(true);
        }
      } else {
        if (isRunning === true) {
          setRunning(false);
          setLastTime(performance.now() - tick);
        }
      }
    }
  ];
};

const App = () => {
  const [lastTime, isRunning, setIsRunning] = useTimer();
  const [{ ButtonType }, setType] = React.useState({ ButtonType: MSButton });
  const [isVisible, setVisible] = React.useState(false);

  React.useEffect(
    () => {
      if (isRunning) {
        setIsRunning(false);
        setVisible(true);
        const id = setTimeout(() => setVisible(false), 2000);
        return () => clearTimeout(id);
      }
    },
    [isRunning]
  );

  const buttons = [];

  if (isRunning || isVisible) {
    for (let i = 0; i < 1000; i++) {
      buttons.push(
        <ButtonType key={i} index={i}>
          Button {i}
        </ButtonType>
      );
    }
  }

  return (
    <Provider renderer={renderer}>
      <div className="App">
        <div>Last run time: {lastTime}</div>
        <div>Click one to generate 1000 random buttons:</div>
        <button
          onClick={() => {
            setType({ ButtonType: MSButton });
            setIsRunning(true);
          }}
        >
          @uifabric/merge-styles
        </button>
        <button
          onClick={() => {
            setType({ ButtonType: EmotionButton });
            setIsRunning(true);
          }}
        >
          @emotion/styled
        </button>
        <button
          onClick={() => {
            setType({ ButtonType: SCButton });
            setIsRunning(true);
          }}
        >
          styled-components
        </button>
        <button
          onClick={() => {
            setType({ ButtonType: FelaButton });
            setIsRunning(true);
          }}
        >
          fela
        </button>
        <button
          onClick={() => {
            setType({ ButtonType: NewMSButton });
            setIsRunning(true);
          }}
        >
          new mergeStyles
        </button>
        <div>{buttons}</div>
      </div>
    </Provider>
  );
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
