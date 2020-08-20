const { uuid, isUuid } = require('uuidv4');

const express = require("express");
const cors = require("cors");
const { json } = require('express');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idIsValid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).send({ error: 'Ooops... id is not valid :(' });

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository)

  return response.json(repository);

});

app.put("/repositories/:id", idIsValid, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0)
    return response.status(400).send('Ooops... repository not found :(')

  const likes = repositories[repositoryIndex].likes;

  const repository = { id, title, url, techs, likes }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", idIsValid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0)
    return response.status(400).send('Ooops... repository not found :(');

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0)
    return response.status(400).send('Ooops... repository not found :(');

  const likes = repositories[repositoryIndex].likes += 1;

  const like = { likes }

  return response.json(like);

});

module.exports = app;
