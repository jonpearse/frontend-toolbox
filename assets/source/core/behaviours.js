/*********************************************************************************************************************
 *
 * Handles the registration and triggering of behaviours.
 *
 *********************************************************************************************************************/

// internal register of behaviours
var oRegister = {};

/**
 * Called by behaviours when they’re included: registers them with the binding system. This is something of a kludge,
 * but I can’t think of a better way of doing it with webpack. Yet.
 *
 * @param   sName       the name of the behaviour
 * @param   sParamNs    the namespace of the behaviour’s parameters (ie: data-namespace-param="") (optional)
 * @param   fCallback   the actual behaviour function that should be called on init.
 */
function registerBehaviour(sName, sParamNs, fCallback)
{
    "use strict";

    // 0. if we’ve already registered that behaviour
    if (oRegister[sName] !== undefined)
    {
        console.error("Attempting to redefine behaviour "+sName);
        return false;
    }

    // 1. if there is no parameter namespace specified
    if ((typeof sParamNs === 'function') && (fCallback === undefined))
    {
        fCallback = sParamNs;
        sParamNs  = sName;
    }

    // 2. store things
    oRegister[sName] = {
        namespace: sParamNs,
        callback:  fCallback
    }

    return true;
}

/**
 * Returns options for a behaviour in a given namespace.
 *
 * @param   el  the element to read from
 * @param   sNamespace  the namespace
 */
function getOptionsFor(el, sNamespace)
{
    "use strict";

    // 1. return variable and regex object
    var oReturn = {};
    var oRegex  = new RegExp('^'+sNamespace);

    // 2. iterate through dataset looking for matching attributes
    for (var k in el.dataset)
    {
        if (el.dataset.hasOwnProperty(k) && oRegex.test(k))
        {
            oReturn[k] = el.dataset[k];
        }
    }

    // 3. return
    return oReturn;
}

/**
 * Called, usually on page load, to start everything going.
 *
 * @param   elCtx   the root of the DOM tree you wish to start behaviours on (optional)
 */
function initBehaviours(elCtx)
{
    "use strict";

    // 1. if there’s no context, set it to the document
    if (elCtx === undefined)
    {
        elCtx = document;
    }

    // 2. start going through anything with a bound behaviour
    elCtx.querySelectorAll('[data-behaviour]').each(function(el)
    {
        var aBound = el.dataset.behaviour.trim().split(/\s+/);

        aBound.forEach(function(sBehaviour)
        {
            // a. if we don’t know about it
            if (oRegister[sBehaviour] === undefined)
            {
                console.warn("Unknown behaviour "+sBehaviour, el);
            }

            // b. call with options
            oRegister[sBehaviour].callback.call(el, getOptionsFor(el, oRegister[sBehaviour].namespace));
        });
    })
}

module.exports = {
    register: registerBehaviour,
    init:     initBehaviours
};
