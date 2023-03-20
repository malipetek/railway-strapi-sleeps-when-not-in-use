module.exports = ({ env }) => ({
  host: '0.0.0.0',
  port: 1337,
  proxy: true, // This makes Strapi (and therefore the Koa instance) aware of the proxy.
  admin: {
    autoOpen: false
  },
  app: {
    keys: env.array("APP_KEYS"),
  },
});
