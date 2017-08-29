/*********************************************************************************************************************
 *
 * Polyfills for the Number object.
 *
 *********************************************************************************************************************/

module.exports = (function()
{
    if (Number.isNaN === undefined)
    {
        /**
         * Provides an implementation of Number.isNaN for those browsers that don’t have it.
         *
         * @param {mixed} value - the value to check.
         * @return {boolean} true if the passed value is NaN, false otherwise.
         */
        Number.prototype.isNaN = value => (typeof value === 'number') && isNaN(value);
    }
}());
