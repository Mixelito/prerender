module.exports = {
    pageLoaded: function(req, res, next) {
        if (!req.prerender.content || req.prerender.renderType != 'html') {
            return next();
        }

        var tagFragmentMatch = /<meta[^<>]*(?:name=['"]fragment['"][^<>]*content=['"]([^'"]*?)['"]|content=['"]([^'"]*?)['"][^<>]*name=['"]fragment['"])[^<>]*>/i,
            head = req.prerender.content.toString().split('</head>', 1).pop(),
            match;

        if (match = tagFragmentMatch.exec(head)) {
            req.prerender.content = req.prerender.content.toString().replace(match[0], '');
        }

        next();
    }
};
