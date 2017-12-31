/**
 * Wrapper for XMLHttpRequest that performs a request to an endpoint on the server, and expects JSON in return.
 */

function objectToQueryString(oData, sPrefix = '')
{
    let sSuffix = (sPrefix === '') ? '' : '%5D';

    return Object.keys(oData).map(k =>
    {
        // if it’s null, bail
        if (oData[k] === null)
        {
            return;
        }

        // if it’s an object, recurse down
        if (typeof oData[k] === 'object')
        {
            return objectToQueryString(oData[k], `${sPrefix}${sSuffix}${encodeURIComponent(k)}%5B`);
        }

        // otherwise…
        return `${sPrefix}${encodeURIComponent(k)}${sSuffix}=${encodeURIComponent(oData[k])}`;

    }).filter(el => el !== null).join('&');
}

const DEFAULT_OPTIONS = {
    sMethod: 'GET',
    bExpectJson: true
};

/**
 * AJAX object that performs a request. This is perhaps bigger than it needs to be, but means I can write far neater
 * code than otherwise.
 *
 * @param {String} sUri - the URI to request the data from
 * @param {mixed} oData - any data to be sent, either as a URI-encoded string, an Object, or a FormData
 * @param {mixed} methodOrOptions - either a string containing the method (GET or POST), or an object containing options
 * @return {Promise} a Promise which is resolved on success, and rejected otherwise.
 */
function AjaxRequest(sUri, oData = null, methodOrOptions = {})
{
    let oXhr;
    let options;
    let fnResolve;
    let fnReject;

    /**
     * Resolves/normalises options.
     */
    function resolveOptions()
    {
        // 1. if it’s a string, normalise to an object
        if (typeof methodOrOptions === 'string')
        {
            methodOrOptions = { sMethod: methodOrOptions };
        }

        // 2. cast options
        options = Object.assign({}, DEFAULT_OPTIONS, methodOrOptions);
    }

    /**
     * Processes data: this will transform the data into a format appopriate for the request method.
     *
     * @return {boolean} whether this process was successful or not.
     */
    function processData()
    {
        // 1. if we’re FormData, null, or a String, show success
        if ((oData === null) || (oData instanceof String) || ((oData instanceof FormData) && (options.sMethod === 'POST')))
        {
            return true;
        }

        // 2. if the data is a formdata object (and implied GET)
        if (oData instanceof FormData)
        {
            // oData = formDataToQueryString(oData);
            return true;
        }

        // 3. otherwise, we’re an object, so serialise that out
        oData = objectToQueryString(oData);
        return true;
    }

    /**
     * Adds an authenticity token header to the request.
     */
    function appendHeaders()
    {
        oXhr.setRequestHeader('authenticity_token', document.querySelector('meta[name=csrf-token]').getAttribute('content'));

        if ((options.sMethod === 'POST') && !(oData instanceof FormData))
        {
            oXhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        }
    }

    /**
     * Appends the data to the end of the URI if we’re performing a GET request.
     */
    function appendIfGet()
    {
        // 1. if not GET, bail
        if ((options.sMethod !== 'GET') || (oData === null))
        {
            return;
        }

        // 2. work out what our separator’s going to be
        let sSep = (sUri.indexOf('?') === -1) ? '?' : '&';

        // 3. append
        sUri += sSep + oData;
    }

    /**
     * Builds a promise object. This is all manner of kludge, but it seems to work…
     *
     * @return {Promise} a promise
     */
    function buildPromise()
    {
        // 1. build the promise
        let oPromise = new Promise((resolve, reject) =>
        {
            fnResolve = resolve;
            fnReject  = reject;
        });

        // 3. return it
        return oPromise;
    }

    /**
     * Tries to parse the response as JSON, and resolves/rejects suitably.
     */
    function resolveAsJSON()
    {
        // 1. if it’s not JSON…
        if (oXhr.getResponseHeader('Content-Type').indexOf('application/json') === -1)
        {
            fnReject(`Expecting JSON, got ${oXhr.getResponseHeader('Content-Type')}`);
            return;
        }

        // 2. try and convert stuff
        let oJson;
        try
        {
            oJson = JSON.parse(oXhr.responseText);
        }
        catch (TypeError)
        {
            fnReject('Could not parse response JSON');
            return;
        }

        // 3. success!
        fnResolve(oJson);
    }

    /**
     * Handles readystatechange events on the XHR object.
     *
     * @return {void}
     */
    function handleReadyStateChange()
    {
        // if we don’t care about this state change, ignore it
        if (oXhr.readyState !== XMLHttpRequest.DONE)
        {
            return;
        }

        // if it failed, reject
        if (oXhr.status !== 200)
        {
            return fnReject(oXhr.statusText);
        }

        // if we’re expecting JSON
        if (options.bExpectJson)
        {
            return resolveAsJSON();
        }

        // otherwise…
        fnResolve(oXhr.responseText);
    }

    return (function init()
    {
        // 0. sort out the options
        resolveOptions();

        // 1. do some data munging
        if (!processData())
        {
            return null;
        }

        // 2. handle GET requests
        appendIfGet();

        // 3. create our XHR object
        oXhr = new XMLHttpRequest();
        oXhr.open(options.sMethod, sUri);
        appendHeaders();

        // 4. set a callback handler
        oXhr.onreadystatechange = handleReadyStateChange;

        // 5. send it!
        oXhr.send(oData);

        // 6. return our promise
        return buildPromise();
    }());
}

module.exports = AjaxRequest;
