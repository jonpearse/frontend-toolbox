/*********************************************************************************************************************
 *
 *
 *
 *********************************************************************************************************************/

/**
 * Binds multiple, string-separated events to a single element in one pass. This is broadly similar to jQuery’s on().
 *
 * @param {HTMLElement} el - the element to which to bind
 * @param {String} sEvtString - a space-separated list of events to bind
 * @param {function} fHandler - the callback function to call when the event fires
 */
module.exports = (el, sEvtString, fHandler) =>
{
    sEvtString.trim().split(/\s+/g).forEach(sEvt => el.addEventListener(sEvt, fHandler));
}
