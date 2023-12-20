import express from 'express';
import { simulateDatabaseIO } from './utils/dbIOSimulation.util';
import { BLOG_DATA } from './mock.data';

import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());

app.get('/', (req, res) => {
  res.json(
    {
      message: 'Run!'
    }
  );
});

app.get('/api/blogs', async (req, res) => {
  try {

    // simulated database IO with delay and some time error
    const data = await simulateDatabaseIO(BLOG_DATA);
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('unknown error');
    }

  }
});

app.post('/api/geojson/parse-file', async (req, res) => {
  try {
    const data = req.body;
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('unknown error');
    }

  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
