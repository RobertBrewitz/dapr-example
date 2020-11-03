import Koa from 'koa';
import Router from 'koa-router';
import axios from 'axios';
import bodyparser from 'koa-bodyparser';
import env from 'env-var';
import { v4 } from 'uuid';

const DAPR_HTTP_PORT = env.get('DAPR_HTTP_PORT').asPortNumber();

const app = new Koa();
const router = new Router();

router.post('/subscriber', async ctx => {
  try {
    const {
      data: { uuid },
    } = ctx.request.body;

    console.log('Fetch state with uuid from message:', uuid);
    const { data } = await axios.get(
      `http://localhost:${DAPR_HTTP_PORT}/v1.0/state/state-name/${uuid}`
    );

    console.log(`Fetched state for key ${uuid}:`, data);
    ctx.status = 200;
  } catch (err) {
    console.error(err);
    ctx.throw(500);
  }
});

router.post('/publisher', async ctx => {
  const uuid = v4();

  try {
    const state = [{ key: uuid, value: { timestamp: Date.now() } }];
    console.log('Storing state:', state);
    await axios.post(
      `http://localhost:${DAPR_HTTP_PORT}/v1.0/state/state-name`,
      state
    );

    const message = { uuid };
    console.log('Publishing message:', message);
    await axios.post(
      `http://localhost:${DAPR_HTTP_PORT}/v1.0/publish/pubsub-name/topic-name`,
      message
    );
    ctx.status = 201;
  } catch (err) {
    console.error(err);
    ctx.throw(500);
  }
});

app.use(
  bodyparser({
    extendTypes: {
      json: ['application/cloudevents+json'],
    },
  })
);

app.use(router.routes());

app.listen(3000, () => console.log('dapr-example is running on port 3000'));
