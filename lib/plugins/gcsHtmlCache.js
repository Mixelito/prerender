// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

module.exports = {
    init: function() {
        // this.cache = cacheManager.caching({
        //     store: gcs_cache
        // });
    },

    requestReceived: function(req, res, next) {
        if(req.method !== 'GET' || req.prerender.url.match(/127\.0\.0\.1(:[0-9]*)?\/healthz/gm)) {
            return next();
        }

        var key = req.prerender.url;
        if (process.env.CACHE_PREFIX_KEY) {
            key = process.env.CACHE_PREFIX_KEY + '/' + key;
        }

        var arquivo = bucket.file(key).createReadStream();
        var result = '';
        arquivo.on('data', function(d) {
            result += d;
        }).on('error', function(d) {
            next();
        }).on('end', function(err) {
            if (!err && result) {
                console.log('cache hit');
                return res.send(200, result);
            }
            next();
        });
    },

    pageLoaded: function(req, res, next) {
        if(req.prerender.statusCode !== 200 || req.prerender.url.match(/127\.0\.0\.1(:[0-9]*)?\/healthz/gm)) {
            return next();
        }

        var key = req.prerender.url;
        if (process.env.CACHE_PREFIX_KEY) {
            key = process.env.CACHE_PREFIX_KEY + '/' + key;
        }
        var file = bucket.file(key);
        file.save(req.prerender.content, {gzip: true}, function(err) {
            if (!err) {
                next();
            } else console.error(err);
        });
    }
};
