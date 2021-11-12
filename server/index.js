require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const downloadImage = require('./download-image');
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
    order by lower("displayName");
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
    order by lower("displayName");
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

app.get('/api/streamers/:channelId/:platform', (req, res, next) => {
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

app.get('/api/streamers/:channelId/:platform', (req, res, next) => {
  if (req.params.platform === 'twitch') {
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
        if (!data.data.length) {
          throw new ClientError(404, `User '${req.params.channelId}' not found`);
        } else {
          const values = data.data[0];
          downloadImage(values.profile_image_url, values.id);
          const sql = `
          insert into "streamers" ("channelId", "displayName", "description",
          "profileImgUrl", "recentVideo", "isTwitch","twitchId", "isLive")
          values ($1, $2, $3, $4, $5, $6, $7, $8)
          returning *;
          `;
          const params = [values.login, values.display_name, values.description,
            values.profile_image_url, `https://www.twitch.tv/${values.login}`, true, values.id, false];
          return db.query(sql, params);
        }
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
        if (!data.data.length) {
          const sql = `
            select *
            from "streamers"
            where "channelId" = $1;
            `;
          const params = [req.params.channelId];
          return db.query(sql, params);
        } else {
          const videoUrl = data.data[0].url;
          const channelId = data.data[0].user_login;
          const sql = `
          update "streamers"
          set "recentVideo" = $1,
          "videoUpdated" = CURRENT_TIMESTAMP
          where "channelId" = $2
          returning *;
          `;
          const params = [videoUrl, channelId];
          return db.query(sql, params);
        }
      })
      .then(data => {
        const profile = data.rows[0];
        res.status(200).json(profile);
      })
      .catch(err => next(err));
  } else { next(); }
});

app.get('/api/streamers/:channelId/:platform', (req, res, next) => {
  fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${req.params.channelId}&key=${process.env.YOUTUBE_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (!data.pageInfo.totalResults) {
        throw new ClientError(404, `User with ID '${req.params.channelId}' not found`);
      } else {
        const values = data.items[0].snippet;
        downloadImage(values.thumbnails.medium.url, data.items[0].id);
        const sql = `
        insert into "streamers" ("channelId", "displayName", "description",
        "profileImgUrl", "recentVideo", "isTwitch","twitchId", "isLive")
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        returning *;
        `;
        const params = [req.params.channelId, values.title, values.description,
          values.thumbnails.medium.url, '', false, null, false];
        return db.query(sql, params);
      }
    })
    .then(data => {
      return fetch(`https://youtube.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${req.params.channelId}&maxResults=25&key=${process.env.YOUTUBE_KEY}`);
    })
    .then(response => response.json())
    .then(data => {
      const activityTypes = data.items.map(element => element.snippet.type);
      const recentUploadIndex = activityTypes.indexOf('upload');
      const videoId = data.items[recentUploadIndex].contentDetails.upload.videoId;
      const sql = `
      update "streamers"
      set "recentVideo" = $1,
      "videoUpdated" = CURRENT_TIMESTAMP
      where "channelId" = $2
      returning *;
      `;
      const params = [videoId, req.params.channelId];
      return db.query(sql, params);
    })
    .then(data => {
      const profile = data.rows[0];
      res.status(200).json(profile);
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

app.put('/api/streamers/current', (req, res, next) => {
  const sql = `
  select "streamerId", "displayName", "channelId", "isTwitch", "lastUpdated", "twitchId"
  from "streamers"
  `;
  db
    .query(sql)
    .then(data => {
      const date = Date.now();
      for (let i = 0; i < data.rows.length; i++) {
        if (date > (data.rows[i].lastUpdated.getTime() - (28800000) + 43200000)) {
          if (data.rows[i].isTwitch) {
            const lastItem = (i === (data.rows.length - 1));
            const twitchId = data.rows[i].twitchId;
            const init = {
              headers: {
                Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
                'Client-Id': process.env.TWITCH_ID,
                type: 'archive'
              }
            };
            fetch(`https://api.twitch.tv/helix/users?id=${twitchId}`, init)
              .then(response => response.json())
              .then(data => {
                const values = data.data[0];
                downloadImage(values.profile_image_url, twitchId);
                const sql = `
                update "streamers"
                set "channelId" = $1,
                  "displayName" = $2,
                  "description" = $3,
                  "profileImgUrl" = $4,
                  "lastUpdated" = CURRENT_TIMESTAMP
                where "twitchId" = $5
                returning *;
                `;
                const params = [values.login, values.display_name, values.description,
                  values.profile_image_url, twitchId];
                return db.query(sql, params);
              })
              .then(data => {
                if (lastItem) { next(); }
              })
              .catch(err => next(err));
          } else if (!data.rows[i].isTwitch) {
            const lastItem = (i === (data.rows.length - 1));
            const channelId = data.rows[i].channelId;
            fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${process.env.YOUTUBE_KEY}`)
              .then(response => response.json())
              .then(data => {
                const values = data.items[0].snippet;
                downloadImage(values.thumbnails.medium.url, data.items[0].id);
                const sql = `
                update "streamers"
                set "displayName" = $1,
                  "description" = $2,
                  "profileImgUrl" = $3,
                  "lastUpdated" = CURRENT_TIMESTAMP
                where "channelId" = $4
                returning *;
                `;
                const params = [values.title, values.description,
                  values.thumbnails.medium.url, channelId];
                return db.query(sql, params);
              })
              .then(data => {
                if (lastItem) { next(); }
              })
              .catch(err => next(err));
          }
        } else {
          const lastItem = (i === (data.rows.length - 1));
          if (lastItem) { next(); }
        }
      }
    })
    .catch(err => next(err));
});

app.put('/api/streamers/current', (req, res, next) => {
  res.status(200).send();
});

app.put('/api/streamers/videos/current', (req, res, next) => {
  const sql = `
  select "streamerId", "displayName", "channelId", "isTwitch", "twitchId",
  "videoUpdated"
  from "streamers"
  `;
  db
    .query(sql)
    .then(data => {
      const date = Date.now();
      for (let i = 0; i < data.rows.length; i++) {
        if (date > (data.rows[i].videoUpdated.getTime() - (25200000) + 7200000)) {
          if (data.rows[i].isTwitch) {
            const lastItem = (i === (data.rows.length - 1));
            const twitchId = data.rows[i].twitchId;
            const init = {
              headers: {
                Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
                'Client-Id': process.env.TWITCH_ID,
                type: 'archive'
              }
            };
            fetch(`https://api.twitch.tv/helix/videos?user_id=${twitchId}`, init)
              .then(response => response.json())
              .then(data => {
                if (!data.data.length) {
                  const sql = `
                  update "streamers"
                  set "videoUpdated" = CURRENT_TIMESTAMP
                  where "twitchId" = $1;
                  `;
                  const params = [twitchId];
                  return db.query(sql, params);
                }
                const values = data.data[0];
                const sql = `
                update "streamers"
                set "recentVideo" = $1,
                "videoUpdated" = CURRENT_TIMESTAMP
                where "channelId" = $2
                returning *;
                `;
                const params = [values.url, values.user_login];
                return db.query(sql, params);
              })
              .then(data => {
                if (lastItem) { next(); }
              })
              .catch(err => next(err));
          } else if (!data.rows[i].isTwitch) {
            const lastItem = (i === (data.rows.length - 1));
            const channelId = data.rows[i].channelId;
            fetch(`https://youtube.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${channelId}&maxResults=25&key=${process.env.YOUTUBE_KEY}`)
              .then(response => response.json())
              .then(data => {
                const activityTypes = data.items.map(element => element.snippet.type);
                const recentUploadIndex = activityTypes.indexOf('upload');
                const videoId = data.items[recentUploadIndex].contentDetails.upload.videoId;
                const sql = `
                update "streamers"
                set "recentVideo" = $1,
                "videoUpdated" = CURRENT_TIMESTAMP
                where "channelId" = $2
                returning *;
                `;
                const params = [videoId, channelId];
                return db.query(sql, params);
              })
              .then(data => {
                if (lastItem) { next(); }
              })
              .catch(err => next(err));
          }
        } else {
          const lastItem = (i === (data.rows.length - 1));
          if (lastItem) { next(); }
        }
      }
    })
    .catch(err => next(err));
});

app.put('/api/streamers/videos/current', (req, res, next) => {
  res.status(200).send();
});

app.delete('/api/likes/:userId/:streamerId', (req, res, next) => {
  const sql = `
  delete from "likes"
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
