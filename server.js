const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Rule = require('./models/rule');
const { createRuleAST, evaluateRule, combineRules, validateAttributes, updateRuleAST } = require('./helpers/astHelper');

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://battulaeshwarakhilesh:cIEWeF7hj3TzEm27@cluster0.7ptwq.mongodb.net/Zeotap', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(e => console.error('Error connecting to MongoDB', e));

app.post('/create_rule', async (req, res) => {
  const { rule } = req.body;
  const catalog = ['age', 'department', 'income', 'spend'];

  try {
    validateAttributes(rule, catalog);
    const ruleAST = createRuleAST(rule); 
    const newRule = new Rule({ ruleAST });
    await newRule.save();
    res.json({ success: true, ruleId: newRule._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/evaluate_rule', async (req, res) => {
  const { ruleId, data } = req.body;
  if (!ruleId || !data) return res.status(400).json({ error: 'Rule ID and data are required.' });

  try {
    const rule = await Rule.findById(ruleId);
    if (!rule) throw new Error('Rule not found');
    const isValid = evaluateRule(rule.ruleAST, data);
    res.json({ success: true, isValid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/combine_rules', async (req, res) => {
  const { rules } = req.body;
  if (!rules || !Array.isArray(rules)) return res.status(400).json({ error: 'Valid rules array is required.' });

  try {
    const combinedAST = combineRules(rules);
    const newRule = new Rule({ ruleAST: combinedAST });
    await newRule.save();
    res.json({ success: true, ruleId: newRule._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/update_rule', async (req, res) => {
  const { ruleId, updates } = req.body;
  try {
    let rule = await Rule.findById(ruleId);
    if (!rule) throw new Error('Rule not found');
    
    rule.ruleAST = updateRuleAST(rule.ruleAST, updates);
    await rule.save();
    
    res.json({ success: true, ruleId: rule._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
