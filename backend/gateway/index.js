const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.get('/auth', (req, res) => res.status(501).json({ message: 'Not implemented' }));
app.get('/workouts', (req, res) => res.status(501).json({ message: 'Not implemented' }));
app.get('/meals', (req, res) => res.status(501).json({ message: 'Not implemented' }));
app.get('/goals', (req, res) => res.status(501).json({ message: 'Not implemented' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
