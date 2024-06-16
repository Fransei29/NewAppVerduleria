const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
