

import express from 'express';
import { spawn } from 'child_process';
import proxy from 'express-http-proxy';

let child;

const app = express();
let timeoutId;
app.use('/', async (req, res, next) => {
  console.log(req.path);

  console.log('!child || child.killed', !child, child?.killed);
  if (!child || child.killed) {
    if (process.argv.indexOf('--local') >= 0) {
      child = spawn(`railway`, ['run', '-e', 'development', '-s', 'Strapi',  'yarn', 'develop'], { stdio: ['pipe', 'inherit', 'inherit', 'ipc'] });
    } else {
      child = spawn(`yarn`, ['develop'], { stdio: ['pipe', 'inherit', 'inherit', 'ipc'] });
    }
    return res.send('Waking up Strapi, please wait...');
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    if (!child.killed) {
      child.kill();
      console.log('Child process killed');
    }
  }, 1 * 60 * 1000); // kill after 1 minute

  next();
}, proxy('http://0.0.0.0:1337'));

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on ', process.env.PORT || 3000);
});

// proxy.onRequest(async (ctx, callback) => {
//   console.log('New request received');

//   let activeRequests = 0;
//   if (!child || child.killed) {
//     child = await $$`railway run -e development -s Strapi yarn develop`;
//   }

//   // Send the request to the backend server
//   const reqData = ctx.clientToProxyRequest.rawBody;
//   const backendReq = http.request({
//     hostname: 'localhost',
//     port: 3444,
//     method: ctx.clientToProxyRequest.method,
//     path: ctx.clientToProxyRequest.url,
//     headers: ctx.clientToProxyRequest.headers,
//   }, (backendRes) => {
//     backendRes.on('data', (chunk) => {
//       console.log(`Received response from backend server: ${chunk}`);
//       // Forward the response to the client
//       ctx.proxyToClientResponse.write(chunk, 'binary');
//     });
//     backendRes.on('end', () => {
//       console.log('Backend server request completed');
//       ctx.proxyToClientResponse.end();
//     });
//   });
//   backendReq.write(reqData);
//   backendReq.end();

//   // Check if there are more requests for the child process
//   let timeoutId = setTimeout(() => {
//     if (activeRequests === 0 && !child.killed) {
//       child.kill();
//       console.log('Child process killed');
//     }
//   }, 10 * 60 * 1000); // 10 minutes

//   // Continue processing the request
//   callback();
// });

// proxy.listen({ port: 3000 }, () => {
//   console.log('Proxy server listening on port 3000');
// });

// `process.exit` callback
process.on('exit', (code) => {
  console.log(`App exits with code "${code}". Synchronous cleanup can be done here.`);
  child?.kill();
});
