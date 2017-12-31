/*********************************************************************************************************************
 *
 * Provides a throttled Window resize event.
 *
 *********************************************************************************************************************/

function fireEvent()
{
    document.body.dispatchEvent(new CustomEvent('windowResized'));
}

(function bindResizeHandler()
{
    let oTo = null;
    window.addEventListener('resize', function()
    {
        clearTimeout(oTo);
        oTo = setTimeout(fireEvent, 50);
    });
}());
