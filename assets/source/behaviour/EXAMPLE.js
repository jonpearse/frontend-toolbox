/*eslint-disable*/
/*********************************************************************************************************************
 *
 * Example behaviour.
 *
 *********************************************************************************************************************/

// require dependencies
// require('util/dependency');

/**
 * Main behaviour function. This is called within the context of the element to which the behaviour is bound.
 *
 * @param   oOptions    an object containing options specified in the element’s data attributes
 * @return  whatever needs to be passed back to the behaviour manager
 */
function ExampleBehaviour(oOptions)
{
    /**
     * Constructor logic
     */
    return (function init()
    {

    }());
}


module.exports = {
    /**
     * Required: the name of the behaviour used in the DOM: this is specified in the data-behaviour="…" attribute of
     * nodes to which this behaviour should be bound
     */
    name:   'example',

    /**
     * Required: the function that should be called to initialise the behaviour. Typically, this will be defined above,
     * but can be defined inline if you’re feeling untidy =)
     */
    init: ExampleBehaviour,

    /**
     * Optional: a prefix for all data-attributes that should be considered ‘options’ for this behaviour.
     *
     * Thus, specifying a namespace of ‘example’ means all ‘data-example-*’ attributes are considered options. Leaving
     * this blank means all data-* attributes are considered options.
     *
     * Default: ''
     */
    namespace: 'example',

    /**
     * Optional: Default options that should be passed to the behaviour when being bound.
     *
     * Default: {}
     */
    defaults: {
        foo: 'bar',
        baz: true
    }
};
