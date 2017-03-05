/* eslint-disable complexity */
/*********************************************************************************************************************
 *
 * Polyfill functions for Object: hoiked from
 *  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
 *
 *********************************************************************************************************************/

module.exports = (function()
{
    if (typeof Object.assign !== 'function')
    {
        Object.prototype.assign = function(target)
        {
            if (target === null)
            {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            let to = Object(target);

            for (let index = 1; index < arguments.length; index++)
            {
                let nextSource = arguments[index];

                if (nextSource !== null)
                {
                    for (let nextKey in nextSource)
                    {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
                        {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
}());
