/*
fix para o codigo do alexa
*/
module.exports = {
    pageLoaded: function(req, res, next) {
        if (!req.prerender.content || req.prerender.renderType != 'html') {
            return next();
        }

        /*
        <script type="text/javascript" async="" src="https://certify-js.alexametrics.com/atrk.js"></script>
        */
        var tagFragmentMatch = /<script(?:.*?)src="https:\/\/certify-js\.alexametrics\.com\/atrk\.js"><\/script>/i,
            head = req.prerender.content.toString().split('</head>', 1).pop(),

            match;

        if (match = tagFragmentMatch.exec(head)) {
            req.prerender.content = req.prerender.content.toString().replace(match[0], '');
        }

        // req.prerender.content = req.prerender.content.toString().replace('<noscript><img src="https://certify.alexametrics.com/atrk.gif?account=NleCg1asOv00oF" style="display:none" height="1" width="1" alt=""></noscript>', '');

        next();
    }
};
/*
<!-- Start Alexa Certify Javascript -->
<script type="text/javascript">
_atrk_opts = { atrk_acct:"NleCg1asOv00oF", domain:"reclameaqui.com.br",dynamic: true};
(function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();
</script>
<noscript><img src="https://certify.alexametrics.com/atrk.gif?account=NleCg1asOv00oF" style="display:none" height="1" width="1" alt="" /></noscript>
<!-- End Alexa Certify Javascript -->  
*/