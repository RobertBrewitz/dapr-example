import Koa from 'koa';
import Router from 'koa-router';
import axios from 'axios';
import bodyparser from 'koa-bodyparser';
import env from 'env-var';
import { v4 } from 'uuid';

const DAPR_HTTP_PORT = env.get('DAPR_HTTP_PORT').asPortNumber();
const OKTA_SUBDOMAIN = '<okta subdomain>';

const app = new Koa();
const router = new Router();

router.get('/login', (ctx) => {
  ctx.redirect('http://localhost:3000/');
});

router.get('/', async (ctx) => {
  ctx.body = `
    <body>
      <form
        method="POST"
        action="//localhost:3001/v1.0/invoke/dapr-example/method/publisher"
      >
        <button>Publish event and get userinfo</button>
      </form>
    </body>
  `;
});

router.post('/subscriber', async (ctx) => {
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

router.post('/publisher', async (ctx) => {
  const uuid = v4();

  try {
    const state = [{ key: uuid, value: { timestamp: Date.now() } }];
    await axios.post(
      `http://localhost:${DAPR_HTTP_PORT}/v1.0/state/state-name`,
      state
    );

    const message = { uuid };
    await axios.post(
      `http://localhost:${DAPR_HTTP_PORT}/v1.0/publish/pubsub-name/topic-name`,
      message
    );

    const { data: userinfo } = await axios.get(
      `https://${OKTA_SUBDOMAIN}.okta.com/oauth2/default/v1/userinfo`,
      {
        headers: { authorization: ctx.request.headers?.authorization },
      }
    );
    ctx.body = `
      <body>
        <form
          method="POST"
          action="//localhost:3001/v1.0/invoke/dapr-example/method/publisher"
        >
          <button>Publish event and get userinfo</button>
        </form>
        <pre>${JSON.stringify({ state, message, userinfo }, null, 2)}</pre>
      </body>
    `;
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
