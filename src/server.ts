import express from 'express';
import payload, { Payload } from 'payload';

require('dotenv').config();
const app = express();

export const seed = async (payload: Payload): Promise<void> => {
  const myHeaders = new Headers();
  myHeaders.append('Request-Token', '75efca15-0732-46a7-9ff9-bfdcf42d0396');
  myHeaders.append(
    'Device-Token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6Ijg2MDU2ZmZmLWJjMmItNDgzYy04NThkLWNjYjE1YjIxMzljOCIsImV4cGlyZXMiOjQ2MzE3NzQ0MDB9.UFGx5F31rwhlJr9yB2JlUlEywjgYdpJKD1S7ef4wexo'
  );
  myHeaders.append('Accept', 'application/vnd.touchnote.v1+json');
  myHeaders.append(
    'Access-Token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF0Zm9ybUlEIjoiMjAwYzI3ZjYtYTdhMi00MjE0LTk3NjEtOGE3Njg2YmRjNjE5In0.fdMjvkZ-AN1imzkUQhnr1uFTDBPWBhPuRjutU6Yp7C0'
  );

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const res = await fetch(
    'https://api.touchnote.io/content/tags',
    requestOptions as any
  );
  const json = await res.json();

  await Promise.all(
    json.tags.map((tag) =>
      payload.create({
        collection: 'tags',
        data: {
          handle: tag.handle,
        },
      })
    )
  );
};

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      await seed(payload);
    },
  });

  // Add your own express routes here

  app.listen(3000);
};

start();
