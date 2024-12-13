const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  ruleAST: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('Rule', RuleSchema);
