const {createServer} = require('http');
const url = require('url');

const PORT = 3000;
let db = [
  {
    id: 1,
    title: 'My wife looked surprised!',
    comedian: 'Kalu',
    year: 2021,
  },
  {
    id: 2,
    title: "Why don't scientists trust atoms?",
    comedian: 'Jain',
    year: 2020,
  },
  {
    id: 3,
    title: "Parallel lines have so much in common.",
    comedian: 'Lola',
    year: 2019,
  }
];

const server = createServer((req, res) => {
  const { method, url: reqUrl } = req;
  const parsedUrl = url.parse(reqUrl, true);

  if (method === 'GET' && parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
  } else if (method === 'POST' && parsedUrl.pathname === '/') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newJoke = JSON.parse(body);
      newJoke.id = db.length + 1;
      db.push(newJoke);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db));
    });
  } else if (method === 'PATCH' || method === 'DELETE') {
    const id = parseInt(parsedUrl.pathname.split('/')[2]);
    const jokeIndex = db.findIndex((joke) => joke.id === id);

    if (jokeIndex !== -1) {
      if (method === 'PATCH') {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          const updatedJoke = JSON.parse(body);
          db[jokeIndex] = { ...db[jokeIndex], ...updatedJoke };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(db[jokeIndex]));
        });
      } else if (method === 'DELETE') {
        const deletedJoke = db.splice(jokeIndex, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedJoke));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Joke not found' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
