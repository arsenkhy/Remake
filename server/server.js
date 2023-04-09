const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api', (req, res) => {
  const data = { message: 'Hello from the API!' };
  res.json(data);
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
