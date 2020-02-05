var cacheManager = require('cache-manager');
var s3 = new (require('aws-sdk')).S3({params:{Bucket: process.env.S3_BUCKET_NAME}});

module.exports = {
    init: function() {
        this.cache = cacheManager.caching({
            store: s3_cache
        });
    },

    requestReceived: function(req, res, next) {
        if(req.method !== 'GET' || req.prerender.url.match(/127\.0\.0\.1(:[0-9]*)?\/healthz/gm)) {
            return next();
        }

        this.cache.get(req.prerender.url, function (err, result) {

            if (!err && result) {
                //console.log('cache hit');
                return res.send(200, result.Body);
            }
            
            next();
        });
    },

    pageLoaded: function(req, res, next) {
        if(req.prerender.statusCode !== 200 || req.prerender.url.match(/127\.0\.0\.1(:[0-9]*)?\/healthz/gm)) {
            return next();
        }

        this.cache.set(req.prerender.url, req.prerender.content, function(err, result) {
            if (err) console.error(err);
            next();
        });
        
    }
};


var s3_cache = {
    get: function(key, callback) {
        if (process.env.CACHE_PREFIX_KEY) {
            key = process.env.CACHE_PREFIX_KEY + '/' + key;
        }

        s3.getObject({
            Key: key
        }, callback);
    },
    set: function(key, value, callback) {
        if (process.env.CACHE_PREFIX_KEY) {
            key = process.env.CACHE_PREFIX_KEY + '/' + key;
        }

        var request = s3.putObject({
            Key: key,
            ContentType: 'text/html;charset=UTF-8',
            StorageClass: 'REDUCED_REDUNDANCY',
            Body: value
        }, callback);

        if (!callback) {
            request.send();
        }
    }
};
