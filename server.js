//configurando o servidor
const express = require("express");
const server = express();

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static("public"));

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }));

//configurar a conexão com o BD
const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "seinaoviu",
  host: "localhost",
  port: 5432,
  database: "doe"
});

// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true,
});

// configurar a apresentação da página
server.get("/", (req, res) => {
  db.query('SELECT * FROM donors', function(err, result) {
      if(err) return res.send('Erro de banco de dados!')

      const donors = result.rows;
      return res.render("index.html", { donors });
    })
});

server.post("/", (req, res) => {
  //pegar dados do formulário
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios!");
  }

  //colocar os valores no bd
  const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`;

  const values = [name, email, blood];

  db.query(query, values, function(err) {
    if (err) return res.send("Erro no banco de dados");

    return res.redirect("/");
  });
});

// ligar o servidor e permitir acesso na porta 300
server.listen(3000, () => {
  console.log("Servidor ON!");
});
