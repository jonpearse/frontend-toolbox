/*********************************************************************************************************************
 *
 * Simple lightbox functionality
 *
 *********************************************************************************************************************/

let ajax = require('util/ajax-request');
let serialiseForm = require('util/formToObject');

function rewriteFormat(sUri)
{
    // if we already have a format
    if (sUri.match(/\.([a-z]+)/))
    {
        return sUri.replace(/\.([a-z]+)/, '.js');
    }

    // if not…
    if (sUri.indexOf('?') !== -1)
    {
        return sUri.replace('?', '.js?');
    }

    return sUri + '.js';
}

function Lightbox()
{
    let elDom = null;
    let elContent = null;
    let fnResolve;
    let fnReject;
    let bKillPadding = false;

    /**
     * Creates a promise.
     *
     * @return {Promise} a Promise whose resolve/reject are exposed to the rest of this object
     */
    function beginPromise()
    {
        return new Promise((resolve, reject) =>
        {
            fnResolve = resolve;
            fnReject  = reject;
        });
    }

    /**
     * Shows the DOM
     */
    function fnOpen()
    {
        elDom.classList.add('-show');
    }

    /**
     * Populates the DOM with some markup/a DOM element.
     *
     * @param {mixed} content - the content to display
     */
    function fnPopulate(content)
    {
        // 1. dump the content in
        if (typeof content === 'string')
        {
            elContent.innerHTML = content;
        }
        else
        {
            elContent.innerHTML = '';
            elContent.appendChild(content);
        }

        // 2. remove any loading class
        elDom.classList.remove('-loading');
        if (bKillPadding)
        {
            elDom.classList.add('-no-padding');
        }

        // 3. bind behaviours
        require('core/behaviours').bind(elContent);

        // 4. job done!
        fnResolve(elContent);
    }

    /**
     * Loads the DOM from a URI.
     *
     * @param {string} sUri - the URI to load from
     * @param {Object} oData - an optional data object to send
     * @param {sMethod} sMethod - the optional method to use
     */
    function fnLoad(sUri, oData = null, sMethod = 'GET')
    {
        fnOpen();
        elDom.classList.add('-loading');
        ajax(sUri, oData, { bExpectJson: false, sMethod: sMethod }).then(fnPopulate, fnReject).catch();
    }

    /**
     * Closes the DOM
     */
    function fnClose()
    {
        elDom.classList.remove('-no-padding');
        elDom.classList.remove('-show');
        elContent.innerHTML = '';
    }

    /**
     * Builds the DOM structure.
     */
    function constructDOM()
    {
        // 1. create the DOM
        elDom = document.createElement('div');
        elDom.className = 'lightbox';
        document.body.appendChild(elDom);

        // 2. create the content
        elContent = document.createElement('div');
        elContent.className = 'lightbox__content';
        elDom.appendChild(elContent);

        // 3. create the close button
        let elClose = document.createElement('button');
        elClose.type = 'button';
        elClose.className = 'lightbox__close';
        elDom.appendChild(elClose);
        elClose.addEventListener('click', fnClose);
    }

    /**
     * Constructor logic
     */
    (function init()
    {
        // 1. construct the DOM
        constructDOM();

        // 2. bind to links within the lightbox so we can hijack them
        elContent.addEventListener('click', ev =>
        {
            let el = ev.target.closest('a');
            if (el !== null)
            {
                fnLoad(rewriteFormat(el.getAttribute('href')));
                ev.preventDefault();
            }
        });

        // 3. bind to forms
        elContent.addEventListener('submit', ev =>
        {
            let elForm = ev.target.closest('form');
            if (elForm !== null)
            {
                fnLoad(rewriteFormat(elForm.getAttribute('action')), serialiseForm(elForm), elForm.getAttribute('method').toUpperCase());
                ev.preventDefault();
            }
        });
    }());

    /** Return a public API */
    return {
        load: (sUri, bNoPadding = false) =>
        {
            let oPromise = beginPromise();
            fnLoad(sUri);

            bKillPadding = bNoPadding;

            return oPromise;
        },
        show: content =>
        {
            let oPromise = beginPromise();

            fnOpen();
            fnPopulate(content);

            return oPromise;
        },
        close: fnClose,
        getContent: () => elContent,
    };
}

module.exports = Lightbox;
