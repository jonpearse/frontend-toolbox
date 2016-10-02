/*********************************************************************************************************************
 *
 * Handles the registration and triggering of behaviours.
 *
 *********************************************************************************************************************/

// internal register of behaviours
var oRegisteredBehaviours = {};

/**
 * Returns options for a behaviour in a given namespace.
 *
 * @param   el  the element to read from
 * @param   sNamespace  the namespace
 */
function getOptionsFor(el, sNamespace, oDefaults)
{
    "use strict";

    // 1. return variable and regex object
    var oReturn = Object.assign(oDefaults);
    var oRegex  = new RegExp('^'+sNamespace+'(.*)$');

    // 2. useful callback function
    var fnAssign = function(key, value)
    {
        // a. if it’s the behaviour hook…
        if ((key === 'behaviour') || (key === 'boundBehaviours'))
        {
            return false;
        }

        // b. if it’s truthy/falsey
        if ((value === 'true') || (value === ''))
        {
            value = true;
        }
        else if (value === 'false')
        {
            value = false;
        }

        // c. convert the key
        key = (''+key).replace(sNamespace, '');
        key = key.substr(0,1).toLowerCase() + key.substr(1);

        // d. assign
        oReturn[key] = value;
    };

    // 3. iterate through dataset looking for matching attributes
    for (var k in el.dataset)
    {
        // a. sanity check. Also, don’t pass ‘behaviour’
        if (!el.dataset.hasOwnProperty(k))
        {
            continue;
        }

        // b. if it looks good, pass off
        if ((sNamespace === '') || oRegex.test(k))
        {
            fnAssign(k, el.dataset[k]);
        }
    }

    // 2. return
    return oReturn;
}

function bindBehaviours(elBindAt)
{
    // 0. default our root element
    elBindAt = elBindAt || document;

    // 1. start binding
    elBindAt.querySelectorAll('[data-behaviour]').each(function(elNode)
    {
        elNode.dataset.behaviour.trim().split(/\s+/).forEach(function(sBehaviour)
        {
            // a. if we don’t know about that behaviour
            if (oRegisteredBehaviours[sBehaviour] === undefined)
            {
                console.warn(`Attempting to bind unknown behaviour ‘${sBehaviour}’`);
                return false;
            }

            // b. if we’ve already bound that behaviour
            elNode.boundBehaviours = elNode.boundBehaviours || {};
            if (elNode.boundBehaviours[sBehaviour] !== undefined)
            {
                console.warn(`Attempting to rebind sBehaviour ’${sBehaviour}‘: ignoring`);
                return false;
            }

            // b. get some options
            var oBehaviour = oRegisteredBehaviours[sBehaviour];
            var oOptions   = getOptionsFor(elNode, oBehaviour.namespace, oBehaviour.defaults);

            // c. debug
            console.group(`Binding component ‘${sBehaviour}’`);
            console.debug('Options:', oOptions);
            console.groupEnd();

            // d. fire the event and store it
            elNode.boundBehaviours[sBehaviour] = oBehaviour.init.call(elNode, oOptions);
        });
    });
}

function registerBehaviours(aoBehaviour, bAutoBind)
{
    // 0. default autobind
    bAutoBind = bAutoBind || true;

    // 1. iterate through behaviours
    aoBehaviour.forEach(function(oBehaviour)
    {
        // a. if we don’t have a name or init
        if ((oBehaviour.name === undefined) || (oBehaviour.init === undefined))
        {
            console.error('Poorly defined behaviour: skipping', oBehaviour);
            return false;
        }

        // b. if we already know about that behaviour
        if (oRegisteredBehaviours[oBehaviour.name] !== undefined)
        {
            console.error(`Attempting to re-register behaviour ‘${oBehaviour.name}’: skipping`);
            return false;
        }

        // c. default some things
        if (oBehaviour.defaults === undefined)
        {
            oBehaviour.defaults = {};
        }
        if (oBehaviour.namespace === undefined)
        {
            oBehaviour.namespace = '';
        }

        // d. register it
        oRegisteredBehaviours[oBehaviour.name] = oBehaviour;
        console.group(`Registered behaviour ‘${oBehaviour.name}’`);
        console.debug('Defaults:',  oBehaviour.defaults);
        console.debug('Namespace:', oBehaviour.namespace);
        console.groupEnd();
    });

    // 2. if we’re autobinding, do so
    (bAutoBind && bindBehaviours());
    return true;
}

module.exports = {
    init: registerBehaviours,
    bind: bindBehaviours
};
