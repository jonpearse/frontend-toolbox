/*********************************************************************************************************************
 *
 * Shims support for NodeList.forEach into browsers that otherwise might not support it.
 *
 *********************************************************************************************************************/
module.exports = (function()
{
    if (typeof NodeList.prototype.forEach !== 'function')
    {
        /**
         * Shims forEach into NodeList for browsers that don’t support it.
         *
         * @param   {function} fCallback - the function to call on each matched element in the NodeList
         */
        NodeList.prototype.forEach = function(fCallback)
        {
            for (let i = 0; i < this.length; i++)
            {
                fCallback(this.item(i), i, this);
            }
        }
    }

}());
