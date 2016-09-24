/*********************************************************************************************************************
 *
 * Duck-punch some additional behaviour into the vanilla JS NodeList object.
 *
 * This is fairly dodgy, but I‘d rather provide an explicit NodeList.toArray() function than constantly invoke the
 * [].slice.call(nodeList) construct.
 *
 *********************************************************************************************************************/
module.exports = (function()
{
    "use strict";

    /**
     * Convert the current object to an array and return it.
     *
     * @return  the current NodeList cast to an array.
     */
    NodeList.prototype.toArray = function()
	{
		return [].slice.call(this);
	};

    /**
     * Provides a simple iterator function for NodeList objects. Internally, this casts the NodeList to an array and
     * calls forEach on it.
     *
     * @param   fCallback   the function to call on each matched element in the NodeList
     */
    NodeList.prototype.each = function(fCallback)
    {
        return this.toArray().forEach(fCallback);
    };

})();
