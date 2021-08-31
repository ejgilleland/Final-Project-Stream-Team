require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const pg = require('pg');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.use(staticMiddleware);

app.get('/api/likes', (req, res, next) => {
  const sql = `
    select *
    from "likes"
    join "streamers" using ("streamerId")
    where "userId" = $1
    and "streamerId" not in
      (select "streamerId"
      from "favorites")
    order by "displayName";
  `;
  const params = [1];
  // will remove the hard coding when authorized user functionality is implemented - selecting userId of 1 for now
  db
    .query(sql, params)
    .then(data => {
      const likes = data.rows;
      res.status(200).json(likes);
    })
    .catch(err => next(err));
});

app.get('/api/favorites', (req, res, next) => {
  const sql = `
    select *
    from "favorites"
    join "streamers" using ("streamerId")
    where "userId" = $1
    order by "displayName";
  `;
  const params = [1];
  // will remove the hard coding when authorized user functionality is implemented - selecting userId of 1 for now
  db
    .query(sql, params)
    .then(data => {
      const favorites = data.rows;
      res.status(200).json(favorites);
    })
    .catch(err => next(err));
});

app.post('/api/favorites/:userId/:streamerId', (req, res, next) => {
  const sql = `
  insert into "favorites" ("userId", "streamerId")
  values ($1, $2);
  `;
  const params = [req.params.userId, req.params.streamerId];
  db
    .query(sql, params)
    .then(data => {
      res.status(201).send();
    })
    .catch(err => next(err));
});

app.delete('/api/favorites/:userId/:streamerId', (req, res, next) => {
  const sql = `
  delete from "favorites"
  where "userId" = $1
  and "streamerId" = $2;
  `;
  const params = [req.params.userId, req.params.streamerId];
  db
    .query(sql, params)
    .then(data => {
      res.status(204).send();
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
