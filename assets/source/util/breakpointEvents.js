/*********************************************************************************************************************
 *
 * Provides custom event functionality for use with breakpointTools. This automatically fires a ‘breakpointChanged’
 * event when the user resizes their browser between breakpoints, as well as providing a number of ‘watcher’-type
 * functions that allow code to be notified when a certain breakpoint is reached.
 *
 * @todo: make bindCustomEvent smart enough to only fire needed ebents. Right now, binding to gte(small) will fire
 *        the callback for any time the viewport changes to something gte small, instead of just the first time
 *
 *********************************************************************************************************************/

let oTools = require('util/breakpointTools');
let sCurrentBreakpoint = null;

/**
 * Assesses the current breakpoint against the one we already have, returns true or false accordingly.
 */
function assessViewport()
{
    // 1. if nothing has changed, bail
    if (oTools.eq(sCurrentBreakpoint))
    {
        return;
    }

    // 2. get a breakpoint, and make sure it’s sensible
    let sNew = oTools.current();
    if (sNew === '')
    {
        return;
    }

    // 3. fire our event handler and update
    document.body.dispatchEvent(new CustomEvent('breakpointChanged', { detail: {
        oldBreakpoint: sCurrentBreakpoint,
        newBreakpoint: sNew,
    }}));
    sCurrentBreakpoint = sNew;
    return;
}

/**
 * Binds a custom event handler based on the viewport changing to a specified breakpoint.
 *
 * @param   {string} sTargetBreakpoint - the breakpoint to target
 * @param   {string} sMatch - the matching function to use (see breakpointTools for more info)
 * @param   {function} fCallback - the callback functions
 * @param   {Object} oOptions - any options you wish to be passed.
 * @return  {EventHandler} the event handler returned
 */
function bindCustomEvent(sTargetBreakpoint, sMatch, fCallback, oOptions = {})
{
    // 0. default our options
    oOptions = Object.assign({
        bOnce: false,
        bImmediate: true
    }, oOptions);

    // 1. sanity check the matching method
    if (oTools[sMatch] === undefined)
    {
        throw new TypeError(`Don’t know how to assess ‘${sMatch}’`);
    }

    // 2. if we’re immediately binding…
    if (oOptions.bImmediate && oTools[sMatch](sTargetBreakpoint))
    {
        // a. fire the callback
        fCallback();

        // b. and if we’re only doing things once, this is that once
        if (oOptions.bOnce)
        {
            return null;
        }
    }

    // 3. otherwise…
    return document.body.addEventListener('breakpointChanged', () =>
    {
        if (oTools[sMatch](sTargetBreakpoint))
        {
            return fCallback();
        }
    }, { once: oOptions.bOnce });

}

/**
 * Bootstrap function. Watches for window resize and fires events when breakpoints are met/left
 */
(function bootstrap()
{

    document.body.addEventListener('windowResized', assessViewport);
    assessViewport();

}());

module.exports = {
    /**
     * General event-handling function.
     */
    on: bindCustomEvent,

    /**
     * Fires an event when the screen is resized to be larger than the specified breakpoint.
     *
     * @param {string} sBreakpoint - the breakpoint to trigger on.
     * @param {function} fCallback - the callback function to run
     * @param {Object} oOptions - event options
     * @return {EventHandler} the event handler object
     */
    whenLarger: (sBreakpoint, fCallback, oOptions = {}) =>
    {
        return bindCustomEvent(sBreakpoint, 'gt', fCallback, oOptions);
    },

    /**
     * Fires an event when the screen is resized to be larger than or equal to the specified breakpoint.
     *
     * @param {string} sBreakpoint - the breakpoint to trigger on.
     * @param {function} fCallback - the callback function to run
     * @param {Object} oOptions - event options
     * @return {EventHandler} the event handler object
     */
    whenLargerOrEqual: (sBreakpoint, fCallback, oOptions = {}) =>
    {
        return bindCustomEvent(sBreakpoint, 'gte', fCallback, oOptions);
    },

    /**
     * Fires an event when the screen is resized to be smaller than the specified breakpoint.
     *
     * @param {string} sBreakpoint - the breakpoint to trigger on.
     * @param {function} fCallback - the callback function to run
     * @param {Object} oOptions - event options
     * @return {EventHandler} the event handler object
     */
    whenSmaller: (sBreakpoint, fCallback, oOptions = {}) =>
    {
        return bindCustomEvent(sBreakpoint, 'lt', fCallback, oOptions);
    },

    /**
     * Fires an event when the screen is resized to be smaller than or equal to the specified breakpoint.
     *
     * @param {string} sBreakpoint - the breakpoint to trigger on.
     * @param {function} fCallback - the callback function to run
     * @param {Object} oOptions - event options
     * @return {EventHandler} the event handler object
     */
    whenSmallerOrEqual: (sBreakpoint, fCallback, oOptions = {}) =>
    {
        return bindCustomEvent(sBreakpoint, 'lte', fCallback, oOptions);
    },

    /**
     * Fires an event when the screen is resized to the size of the specified viewport
     *
     * @param {string} sBreakpoint - the breakpoint to trigger on.
     * @param {function} fCallback - the callback function to run
     * @param {Object} oOptions - event options
     * @return {EventHandler} the event handler object
     */
    whenMatch: (sBreakpoint, fCallback, oOptions = {}) =>
    {
        return bindCustomEvent(sBreakpoint, 'eq', fCallback, oOptions);
    }
};
