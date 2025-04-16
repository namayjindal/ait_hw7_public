import './config.mjs'
import mongoose from 'mongoose'
import express from 'express'
import Question from './db.mjs'
import url from 'url'
import path from 'path'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.json());

app.get('/questions/', async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch(err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.post('/questions/:id/answers/', async (req, res) => {
  const update = { "$push": { answers: req.body.answer } }
  try {
    const result = await Question.findByIdAndUpdate(req.params.id, update, { "new": true })
    res.json({ success: 'Added an answer' })
  } catch(e) {
    res.status(500).json({ error: 'Failed to add answer' })
  }
})

app.post('/questions/', async (req, res) => {
  try {
    const newQuestion = new Question({
      question: req.body.question,
      answers: []
    });
    const savedQuestion = await newQuestion.save();
    res.json(savedQuestion);
  } catch(err) {
    console.error('Error creating question:', err);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

const port = process.env.PORT ?? 3000
app.listen(port, () => {console.log(`Server is listening on ${port}`)})
