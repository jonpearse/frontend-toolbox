/*********************************************************************************************************************
 *
 * Shims support for NodeList.forEach into browsers that otherwise might not support it.
 *
 *********************************************************************************************************************/
module.exports = (function()
{
    /**
     * Shims forEach into NodeList for browsers that don’t support it.
     *
     * @param   fCallback   the function to call on each matched element in the NodeList
     */
    if (NodeList.forEach === undefined)
    {
        NodeList.prototype.forEach = function(fCallback)
        {
            for (let i = 0; i < this.length; i++)
            {
                fCallback(this.item(i), i, this);
            }
        }
    }

}());
