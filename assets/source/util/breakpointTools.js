/*********************************************************************************************************************
 *
 * Provides a way of working out which CSS breakpoint we’re looking at from JS.
 *
 *********************************************************************************************************************/

let aBreakpoint = [];

/**
 * Bootstrap function: loads breakpoints in from CSS.
 */
(function bootstrap()
{
    // 1. Load in from the CSS
    let sBreaks = window.getComputedStyle(document.body, ':before').fontFamily;
    let aMatch = sBreaks.match(/\(((?:[a-z]+:\s*\d+px(?:,\s)?)+)\)/);
    if (aMatch === null)
    {
        return false;
    }

    // 2. split individual breakpoints out
    aBreakpoint = aMatch[1].split(/,\s*/).map(sBreak =>
    {
        let aBreak = sBreak.split(/:\s*/);
        return { name: aBreak[0], size: parseInt(aBreak[1], 10) };

    }).sort((a, b) => b.size < a.size).map(oBreak => oBreak.name);

    console.group('Breakpoint Tools initialised');
    console.debug('Found breakpoints: ', aBreakpoint);
    console.groupEnd();
}());

/**
 * Returns the current breakpoint.
 *
 * @return {String} the name of the current breakpoint
 */
function getCurrentBreakpoint()
{
    return window.getComputedStyle(document.body, ':before').content.replace(/[^a-z]/g, '');
}

/**
 * Returns whether the browser dimension matches the specified breakpoint.
 *
 * @param {string} sBreakpoint - the breakpoint to match
 * @return {boolean} true if the browser matches the specified breakpoint, false otherwise
 */
function matchesCurrentBreakpoint(sBreakpoint)
{
    return (sBreakpoint === getCurrentBreakpoint());
}

/**
 * Returns whether the browser dimension is larger than the specified breakpoint
 *
 * @param {string} sBreakpoint - the breakpoint to test against
 * @return {boolean} true if the browser is larger than the specified breakpoint
 */
function largerThanBreakpoint(sBreakpoint)
{
    let iCurr = aBreakpoint.indexOf(getCurrentBreakpoint());
    let iTest = aBreakpoint.indexOf(sBreakpoint);

    return (iCurr > iTest);
}

/**
 * Returns whether the browser dimension is larger than or matches the specified breakpoint.
 *
 * @param {string} sBreakpoint - the breakpoint to test against
 * @return {boolean} true if the browser matches, or is larger than the specified breakpoint
 */
function largerThanOrMatchesBreakpoint(sBreakpoint)
{
    let iCurr = aBreakpoint.indexOf(getCurrentBreakpoint());
    let iTest = aBreakpoint.indexOf(sBreakpoint);

    return (iCurr >= iTest);
}

/**
 * Returns whether the browser dimension is smaller than the specified breakpoint
 *
 * @param {string} sBreakpoint - the breakpoint to test against
 * @return {boolean} true if the browser is smaller than the specified breakpoint
 */
function smallerThanBreakpoint(sBreakpoint)
{
    let iCurr = aBreakpoint.indexOf(getCurrentBreakpoint());
    let iTest = aBreakpoint.indexOf(sBreakpoint);

    return (iCurr < iTest);
}

/**
 * Returns whether the browser dimension is smaller than or matches the specified breakpoint.
 *
 * @param {string} sBreakpoint - the breakpoint to test against
 * @return {boolean} true if the browser matches, or is smaller than the specified breakpoint
 */
function smallerThanOrMatchesBreakpoint(sBreakpoint)
{
    let iCurr = aBreakpoint.indexOf(getCurrentBreakpoint());
    let iTest = aBreakpoint.indexOf(sBreakpoint);

    return (iCurr <= iTest);
}

/** - PUBLIC API */
module.exports = {
    current: getCurrentBreakpoint,
    eq: matchesCurrentBreakpoint,
    gt: largerThanBreakpoint,
    gte: largerThanOrMatchesBreakpoint,
    lt: smallerThanBreakpoint,
    lte: smallerThanOrMatchesBreakpoint,
};
