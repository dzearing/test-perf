import { createRenderer } from "fela";
import embedded from "fela-plugin-embedded";
import prefixer from "fela-plugin-prefixer";
import fallbackValue from "fela-plugin-fallback-value";
import unit from "fela-plugin-unit";
import logger from "fela-plugin-logger";

export default () => {
  const renderer = createRenderer({
    plugins: [embedded(), prefixer(), fallbackValue(), unit(), logger()]
  });

  return renderer;
};
