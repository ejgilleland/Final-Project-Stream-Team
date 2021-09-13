require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const fetch = require('node-fetch');

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

app.get('/api/streamers/:channelId', (req, res, next) => {
  const sql = `
  select *
  from "streamers"
  where "channelId" = $1;
  `;
  const params = [req.params.channelId];
  db
    .query(sql, params)
    .then(data => {
      const profile = data.rows;
      if (profile.length) {
        res.status(200).json(profile[0]);
      } else { next(); }
    })
    .catch(err => next(err));
});

app.get('/api/streamers/:channelId', (req, res, next) => {
  const init = {
    headers: {
      Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
      'Client-Id': process.env.TWITCH_ID,
      type: 'archive'
    }
  };
  fetch(`https://api.twitch.tv/helix/users?login=${req.params.channelId}`, init)
    .then(response => response.json())
    .then(data => {
      const values = data.data[0];
      const sql = `
      insert into "streamers" ("channelId", "displayName", "description",
      "profileImgUrl", "recentVideo", "isTwitch","twitchId", "isLive")
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning *;
      `;
      const params = [values.login, values.display_name, values.description,
        values.profile_image_url, '', true, values.id, false];
      return db.query(sql, params);
    })
    .then(data => {
      const profile = data.rows[0];
      const init = {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
          'Client-Id': process.env.TWITCH_ID
        }
      };
      return fetch(`https://api.twitch.tv/helix/videos?user_id=${profile.twitchId}`, init);
    })
    .then(response => response.json())
    .then(data => {
      const videoUrl = data.data[0].url;
      const channelId = data.data[0].user_login;
      const sql = `
      update "streamers"
      set "recentVideo" = $1
      where "channelId" = $2
      returning *;
      `;
      const params = [videoUrl, channelId];
      return db.query(sql, params);
    })
    .then(data => {
      const profile = data.rows[0];
      res.status(200).json(profile);
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

app.post('/api/likes/:userId/:streamerId', (req, res, next) => {
  const sql = `
  insert into "likes" ("userId", "streamerId")
  values ($1, $2);
  `;
  const params = [req.params.userId, req.params.streamerId];
  db
    .query(sql, params)
    .then(data => {
      res.status(201).send();
    })
    .catch(err => {
      if (err.code === '23505') {
        next(new ClientError(400, 'You are already following this profile'));
      } else {
        next(err);
      }
    });
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
