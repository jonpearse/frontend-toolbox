/**
 * Creates an HTMLElement representing an icon. This creates an I element, with the appropriate classes.
 *
 * @param   {string} sIcon - the icon to embed
 * @param   {Object} options - any additional options you wish to be passed to the icon
 * @return  {HTMLElement} the icon as an HTMLElement
 */
function createIconDOM(sIcon, options = {})
{
    // 0. default the class
    options.class = options.class || '';

    // 1. create our element
    let elI = document.createElement('i');
    elI.className = `i i-${sIcon} ${options.class}`;

    // 2. if we have a title
    if (options.title !== undefined)
    {
        elI.setAttribute('title', options.title);
    }
    else
    {
        // we don’t so hide the icon from AT
        elI.setAttribute('aria-hidden', 'true');
    }

    return elI;
}

/**
 * Similar to insertIcon above, but returns the SVG code as a string.
 *
 * @param   {string} sIcon - the icon to embed
 * @param   {Object} options - any additional options you wish to be passed to the icon
 * @return  {string} the SVG code for the required icon
 */
function createIconString(sIcon, options)
{
    let el = document.createElement('span');
    el.appendChild(createIconDOM(sIcon, options));

    return el.innerHTML;
}

module.exports = {
    icon: createIconDOM,
    string: createIconString
};
