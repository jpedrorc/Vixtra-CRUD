import Router from "express";

const router = Router();
const projects = [];
var count = 0;

router.use((req, res, next) => {
  console.log(`Foram feitas ${(count = count + 1)} requisições`);
  next();
});

router.use("/projects/:id", (req, res, next) => {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id == req.params.id) {
      var continueAPI = true;
    }
  }
  continueAPI
    ? next()
    : res.status(404).send("id não encontrado, por favor verifique novamente");
  return;
});

router.post("/projects", (req, res) => {
  if (Object.keys(req.body).length > 2) {
    res
      .status(400)
      .send(
        "Por favor verifique o corpo da requisição, ela deve conter apenas o 'id' e o 'title' do novo projeto"
      );
  } else {
    if (!req.body.id || req.body.id == "") {
      res.status(400).send("Por favor verifique o campo 'id' da requisição");
    } else if (!req.body.title || req.body.title == "") {
      res.status(400).send("Por favor verifique o campo 'title' da requisição");
    } else {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id == req.body.id) {
          res
            .status(400)
            .send(
              "Por favor verifique o campo 'id' da requisição, valor já existente cadastrado"
            );
          return;
        }
      }
      projects.push(req.body);
      res.send("Projeto incluido com sucesso");
    }
  }
  return;
});

router.post("/projects/:id/tasks", (req, res) => {
  if (Object.keys(req.body).length > 1) {
    res
      .status(400)
      .send(
        "Por favor verifique o corpo da requisição, ela deve conter apenas o 'title' da nova tarefa"
      );
  } else if (!req.body.title || req.body.title == "") {
    res.status(400).send("Por favor verifique o campo 'title' da requisição");
  } else {
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id == req.params.id) {
        if (!projects[i].tasks) {
          projects[i] = { ...projects[i], tasks: [`${req.body.title}`] };
        } else {
          projects[i].tasks.push(req.body.title);
        }
        res.send("Tarefa Adicionada");
      }
    }
  }
  return;
});
router.get("/projects/", (req, res) => {
  projects.length == 0 ? res.send("Projetos Vazios") : res.send(projects);
  return;
});

router.put("/projects/:id", (req, res) => {
  if (Object.keys(req.body).length > 1) {
    res
      .status(400)
      .send(
        "Por favor verifique o corpo da requisição, deve conter apenas o title a ser alterado"
      );
  } else if (!req.body.title || req.body.title == "") {
    console.log(req.body.title, 2);
    res
      .status(400)
      .send("Por favor verifique o 'title' no corpo da requisição.");
  } else {
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id == req.params.id) {
        if (projects[i].title == req.body.title) {
          res.send(
            "Title cadastrado possui o mesmo valor do corpo da requisição"
          );
          return;
        }
        projects[i].title = req.body.title;
        res.send("Title alterado!").status(202);
        return;
      }
    }
  }
  return;
});

router.delete("/projects/:id", (req, res) => {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id == req.params.id) {
      projects.splice(i, 1);
      res.send(`id ${req.params.id} excluido com sucesso`);
      return;
    }
  }
});

export { router };
