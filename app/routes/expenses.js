const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../model/User');
const Expense = require('../model/Expense');
const router = express.Router();

router.post(
  '/',
  [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty()
  ]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, amount, category, date } = req.body;
      const newExpense = new Expense({
        user: req.user.id,
        name,
        amount,
        category,
        date
      });

      const expense = await newExpense.save();
      res.json(expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await expense.remove();

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
