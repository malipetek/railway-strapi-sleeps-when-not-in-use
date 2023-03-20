module.exports = ({ env }) => ({
  host: '0.0.0.0',
  port: 1337,
  proxy: true, // This makes Strapi (and therefore the Koa instance) aware of the proxy.
  url: process.env.RAILWAY_STATIC_URL || "http://localhost:3000/",
  admin: {
    url: (process.env.RAILWAY_STATIC_URL || "http://localhost:3000") + "/admin",
    autoOpen: false
  },
  app: {
    keys: env.array("APP_KEYS"),
  },
});
