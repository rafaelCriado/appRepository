const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  try {
    return response.json(repositories);
  } catch (error) {
    return response.status(500).json({
      message : 'Internal server error!',
    });
  }
});

app.post("/repositories", (request, response) => {
  try {
    const { title, url, techs } = request.body;
    // todos os campos são obrigatórios
    if(!title || title === '' || !url || url === '' || !techs || techs.length <=0){
      return response.status(400).json({
        message : 'The title, url and techs fields are required',
      });
    }

    // Campo tech deve ser array
    if(!Array.isArray(techs)){
      return response.status(400).json({
        message : 'The field techs must be an array',
      });
    }

    const repository = { id: uuid(), title, url, techs, likes: 0 }; 
    repositories.push(repository);

    return response.json(repository);
  } catch (error) {
    return response.status(500).json({
      message : 'Internal server error!',
    });
  }
});

app.put("/repositories/:id", (request, response) => {
  try {
    
    const { id } = request.params;

    const repository = repositories.find(r => r.id === id);

    if(!repository){
      return response.status(400).json({
        message : 'The repository does not exist!',
      });
    }

    const { title, url , techs } = request.body;

    if(techs){
      // Caso passe o campo tech o mesmo deve 
      if(!Array.isArray(techs) || techs.length <= 0){
        return response.status(400).json({
          message : 'The field techs must be an array',
        });
      }
      repository.techs = techs;
    }

    if(title && title !== '') repository.title = title;
    if(url && url !== '') repository.url = url;

    return response.json(repository);

  } catch (error) {
    return response.status(500).json({
      message : 'Internal server error!',
    });
  }
});

app.delete("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params;

    const indexRepo = repositories.findIndex(r => r.id === id);

    if(indexRepo < 0){
      return response.status(400).json({
        message : 'The repository does not exist!',
      });
    }
    repositories.splice(indexRepo, 1);
    return response.status(204).json();
    
  } catch (error) {
    return response.status(500).json({
      message : 'Internal server error!',
    });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  try {
    const { id } = request.params;

    const repository = repositories.find(r => r.id === id);

    if(!repository){
      return response.status(400).json({
        message : 'The repository does not exist!',
      });
    }

    repository.likes = repository.likes + 1;
    return response.json(repository);

  } catch (error) {
    return response.status(500).json({
      message : 'Internal server error!',
    });
  }
});

module.exports = app;
