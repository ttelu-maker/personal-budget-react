// server.js (project root)
const express = require('express');
const cors = require('cors');

const app = express();

// allow the React dev server (http://localhost:3000) to call this API
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Simple in-memory data that matches what your frontend expects
const data = {
  "myBudget": [
    { "title": "Rent",           "budget": 450 },
    { "title": "Groceries",      "budget": 120 },
    { "title": "Utilities",      "budget": 90  },
    { "title": "Transport",      "budget": 100 },
    { "title": "Entertainment",  "budget": 180 },
    { "title": "Savings",        "budget": 60  },
    { "title": "Eat out",        "budget": 30  }
  ]
}


// GET /budget -> { myBudget: [...] }
app.get('/budget', (req, res) => {
  res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
