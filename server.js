#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    // logRequests: true,
    //--disable-dev-shm-usage
    //--user-data-dir=/tmp
    //--disk-cache-dir=/tmp
    userAgent: ' Prerender (+https://github.com/prerender/prerender)',
    chromeFlags: ['--user-agent=" Prerender (+https://github.com/prerender/prerender)"', '--disable-web-security','--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--disable-dev-shm-usage', '--hide-scrollbars', '--disk-cache-dir=/tmp']
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.blockResources());
// server.use(prerender.removeScriptTags());
server.use(prerender.removeHeadTagAlexa());
server.use(prerender.httpHeaders());
server.use(prerender.removeMetaTagFragment());
server.use(prerender.s3HtmlCache());

server.start();
