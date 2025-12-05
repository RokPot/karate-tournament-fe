const newline = require("./newline");

const template = (variables, { tpl, ...rest }, hey) => {
  return tpl`
${variables.imports}

${newline}

${variables.interfaces};

export const ${variables.componentName.slice(3) + "Icon"} = (${variables.props}) => (
${variables.jsx}
);
`;
};

module.exports = template;
