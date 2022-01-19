const express = require('express');
const fs = require('fs').promises;
const { writeFile } = require('fs').promises;
const bodyParser = require('body-parser');

const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const validateAge = require('./middlewares/validateAge');
const validateName = require('./middlewares/validateName');
const validateToken = require('./middlewares/validateToken');
const validateTalk = require('./middlewares/validateTalk');
const validateRate = require('./middlewares/validateRate');
const validateWatchedAT = require('./middlewares/validateWatchedAT');

const app = express();
app.use(bodyParser.json());

const talkerJson = 'talker.json';
const NotFound = 'Pessoa palestrante não encontrada';
const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateRate,
  validateWatchedAT,
  async (req, res) => {
  const { name, age, talk } = req.body;
  const talker = JSON.parse(await fs.readFile(talkerJson, 'utf-8'));

  const newTalker = { age, id: talker.length + 1, name, talk };
  const newTalkers = [...talker, newTalker];

  await writeFile(talkerJson, JSON.stringify(newTalkers));

  return res.status(201).json(newTalker);
},
);

app.get('/talker', async (req, res) => {
  const talker = await fs.readFile(talkerJson, 'utf-8');
  return res.status(200).json(JSON.parse(talker));
});

// tive ajuda de colegas na sala do zoom para resolver problemas no teste
app.post('/login', validatePassword, validateEmail, (request, response) => response
.status(200).json({ token: '7mqaVRXJSp886CGr' }));

app.get(
'/talker/search',
validateToken,
async (req, res) => {
    const { searchTerm } = req.query;
    const talker = JSON.parse(await fs.readFile(talkerJson, 'utf-8'));

    if (!searchTerm) return res.status(200).json(talker);

    const filter = talker.filter(({ name }) => name.includes(searchTerm));

    if (filter.length === 0) return res.status(200).json([]);

    return res.status(200).json(filter);
  },
);

app.delete(
'/talker/:id',
validateToken,
async (req, res) => {
  const { id } = req.params;
  const talker = await fs.readFile(talkerJson, 'utf-8');
  const talkerId = JSON.parse(talker).find((r) => r.id === +id);
  
  await writeFile(talkerJson, JSON.stringify(talkerId));
  
  return res.status(204).json();
},
);

app.put(
'/talker/:id',
validateToken,
validateName,
validateAge,
validateTalk,
validateRate,
validateWatchedAT,
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  const talker = await fs.readFile(talkerJson, 'utf-8');
  const talkerId = JSON.parse(talker).filter((r) => r.id === +id);

  const editTalker = { id: Number(id), name, age, talk };
  const editTalkers = [...talkerId, editTalker];
  await writeFile(talkerJson, JSON.stringify(editTalkers));

  return res.status(200).json(editTalker);
},
);

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await fs.readFile(talkerJson, 'utf-8');
  const talkerId = JSON.parse(talker).find((r) => r.id === +id);

  if (!talkerId) return res.status(404).json({ message: `${NotFound}` });
  return res.status(200).json(talkerId);
});

app.listen(PORT, () => {
  console.log('Online');
});
