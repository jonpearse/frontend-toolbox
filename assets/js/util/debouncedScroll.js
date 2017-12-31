/*********************************************************************************************************************
 *
 * Provides a debounced Window resize event.
 *
 *********************************************************************************************************************/

function fireEvent()
{
    document.body.dispatchEvent(new CustomEvent('windowScrolled'));
}

(function bindResizeHandler()
{
    // 0. set status flags
    let bLock = false;  // locked from firing events
    let bTrig = false;  // event is queued

    window.addEventListener('scroll', function()
    {
        // a. flag as having been triggered
        bTrig = true;

        // b. if we’re locked out, bail
        if (bLock)
        {
            return true;
        }

        // c. lock, release the trigger, and fire
        bLock = true;
        bTrig = false;
        fireEvent();

        // d. set the timeout
        setTimeout(function()
        {
            bLock = false;

            if (bTrig)
            {
                fireEvent();
            }
        }, 100);

        return true;
    })
}());
