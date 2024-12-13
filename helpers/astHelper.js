class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

const functionCatalog = {
  isEven: (value) => value % 2 === 0,
  isPositive: (value) => value > 0,
};

const createRuleAST = (ruleString) => {
  try {
    const tokens = ruleString.match(/(\w+\s*(>=|<=|!=|>|<|=|FUNC)\s*'.+?'|\w+\s*(>=|<=|!=|>|<|=|FUNC)\s*\d+|AND|OR|\(|\))/g);
    if (!tokens) throw new Error('Invalid rule string format');

    const operatorPrecedence = { OR: 1, AND: 2 };
    const stack = [];
    const output = [];
    const applyOperator = () => {
      const operator = stack.pop();
      const right = output.pop();
      const left = output.pop();
      output.push(new Node('operator', left, right, operator));
    };

    tokens.forEach(token => {
      if (token === '(') stack.push(token);
      else if (token === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') applyOperator();
        stack.pop();
      } else if (['AND', 'OR'].includes(token)) {
        while (stack.length && operatorPrecedence[stack[stack.length - 1]] >= operatorPrecedence[token]) applyOperator();
        stack.push(token);
      } else {
        const match = token.match(/^(\w+)\s*(>=|<=|!=|>|<|=|FUNC)\s*('.*?'|".*?"|\d+|[a-zA-Z]+)$/);
        if (match) {
          const [, attribute, operator, value] = match;
          output.push(new Node('operand', null, null, {
            attribute,
            operator,
            value: isNaN(parseFloat(value)) ? value.replace(/['"]+/g, '') : parseFloat(value),
          }));
        } else {
          throw new Error(`Invalid token in rule: ${token}`);
        }
      }
    });

    while (stack.length) applyOperator();
    return output[0];
  } catch (error) {
    throw new Error('Failed to parse rule string: ' + error.message);
  }
};

const evaluateRule = (node, data) => {
  if (!node) return true;

  if (node.type === 'operand') {
    let { attribute, operator, value } = node.value;
    let dataValue = data[attribute];
    if (dataValue === undefined || dataValue === null) return false;

    if (operator === 'FUNC') {
      const func = functionCatalog[value];
      if (!func) throw new Error(`Unknown function: ${value}`);
      return func(dataValue);
    }

    switch (operator) {
      case '>': return dataValue > value;
      case '<': return dataValue < value;
      case '=': return dataValue === value;
      case '!=': return dataValue !== value;
      case '>=': return dataValue >= value;
      case '<=': return dataValue <= value;
      default: return false;
    }
  }

  if (node.type === 'operator') {
    const leftEval = evaluateRule(node.left, data);
    const rightEval = evaluateRule(node.right, data);
    return node.value === 'AND' ? leftEval && rightEval : leftEval || rightEval;
  }

  return false;
};

const combineRules = (ruleStrings) => {
  const ruleASTs = ruleStrings.map(ruleString => createRuleAST(ruleString));
  const root = ruleASTs.reduce((combinedAST, currentAST) => {
    if (!combinedAST) return currentAST;
    return new Node('operator', combinedAST, currentAST, 'AND');
  }, null);
  return root;
};

const validateAttributes = (ruleString, catalog) => {
  const attributes = ruleString.match(/\b\w+(?=\s*[<>=!])/g);
  if (!attributes) return true;
  for (const attr of attributes) {
    if (!catalog.includes(attr)) throw new Error(`Invalid attribute: ${attr}`);
  }
  return true;
};

const updateRuleAST = (ruleAST, updates) => {
  const applyUpdates = (node) => {
    if (!node) return;

    if (node.type === 'operand' && updates[node.value.attribute]) {
      const { operator, value } = updates[node.value.attribute];
      if (operator) node.value.operator = operator; 
      if (value) node.value.value = value; 
    }

    if (node.type === 'operator') {
      applyUpdates(node.left);
      applyUpdates(node.right);
    }
  };

  applyUpdates(ruleAST);
  return ruleAST;
};

module.exports = { createRuleAST, evaluateRule, combineRules, validateAttributes, updateRuleAST };
