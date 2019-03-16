import { getStyleElement } from "./getStyleElement";

const _rules: {
  [key: string]: {
    [key: string]: {
      [key: string]: string;
    };
  };
} = {};

export function getClass(rulesString) {
  const classNames = [];
  const selectors = _getSelectors(rulesString);

  for (const selector in selectors) {
    const rules = selectors[selector];

    for (let rulePart of rules) {
      rulePart = rulePart.trim();

      if (rulePart) {
        const rule = rulePart.split(":");
        const name = rule[0].trim();
        const value = rule[1].trim();

        classNames.push(
          _findClass(selector, name, value) || _addClass(selector, name, value)
        );
      }
    }
  }

  return classNames.join(" ");
}

function _getSelectors(rules) {
  const selectors = {
    "&": []
  };
  let selector = "&";
  const lines = rules.split("\n");

  for (let line of lines) {
    const startIndex = line.indexOf("{");
    const endIndex = line.indexOf("}");

    if (startIndex > -1) {
      selector = line.substr(0, startIndex).trim();
      if (selector.indexOf("&") === -1) {
        selector = "&" + selector;
      }
    } else if (endIndex > -1) {
      selector = "&";
    } else {
      line = line.trim();
      if (line) {
        selectors[selector] = selectors[selector] || [];
        selectors[selector].push(line);
      }
    }
  }

  return selectors;
}

function _findClass(selector, name, value) {
  const names = (_rules[selector] = _rules[selector] || {});
  const values = (names[name] = names[name] || {});

  return values[value];
}

function _addClass(selector: string, name: string, value: string): string {
  const className = (_rules[selector][name][value] = getClassName());

  _insertRule(selector.replace(/&/g, "." + className), name, value);

  return className;
}

function _insertRule(selector, name, value) {
  const style = getStyleElement();
  const rule = `${selector}{${name}:${value};}`;

  style.sheet.insertRule(rule);
}

const Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let _counter = 0;

function getClassName(): string {
  return "a" + _counter++;
}
