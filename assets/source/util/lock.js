/*********************************************************************************************************************
 *
 * Simple-ish implementation of a deadlocking system, with named locks and functional queueing.
 *
 * @TODO: timeout on locks?
 *
 *********************************************************************************************************************/

const DEFAULT_LOCK_NAME = 'lock';

export default (function()
{
    let oLockStore = {};
    let aQueue = [];

    /**
     * Runs any functions in the queue based on the current lock/
     *
     * @param   {string} sLockName - the name of the lock
     */
    function runQueueFor(sLockName)
    {
        aQueue.filter((oI) =>
        {
            if (oI.sLock === sLockName)
            {
                oI.fCb();
                return false;
            }
            return true;
        });
    }

    /**
     * Sets a default value for a lock. Means we only do it once…
     *
     * @param   {string}    sLockName - the name of the lock
     * @param   {boolean}   bCreate - whether to create the lock if it doesn’t exist (default: true)
     * @return  {boolean}   if the lock already existed
     */
    function setup(sLockName, bCreate = true)
    {
        if (oLockStore[sLockName] !== undefined)
        {
            return true;
        }

        if (bCreate)
        {
            oLockStore[sLockName] = false;
        }

        return false;
    }

    /**
     * Tries to get a lock with the given name.
     *
     * @param   {string}    sLockName - an optional lock name
     * @return  {boolean}   whether the attempt was successful
     */
    function lock(sLockName = DEFAULT_LOCK_NAME)
    {
        setup(sLockName);

        // if we’re already locking, fail
        if (oLockStore[sLockName] === true)
        {
            return false;
        }

        // otherwise lock
        console.debug(`[LOCK] locking ‘${sLockName}’`);
        oLockStore[sLockName] = true;
        return true;
    }

    /**
     * Releases a lock with the given name. This will warn (in dev) if you try to release a lock that hasn’t been defined.
     *
     * @param   {string}    sLockName - an optional lock name to remove
     * @return  {void}
     */
    function unlock(sLockName = DEFAULT_LOCK_NAME)
    {
        // if the lock doesn’t exist
        if (!setup(sLockName, false))
        {
            console.warn(`[LOCK] Trying to release unknown lock ‘${sLockName}’`);
            return;
        }

        // otherwise release it
        console.debug(`[LOCK] releasing ‘${sLockName}’`);
        oLockStore[sLockName] = false;

        // run anything in the queue
        runQueueFor(sLockName);
        return;
    }

    /** - PUBLIC API - */
    return {
        /**
         * Tries to get a lock with the given name.
         *
         * @param   {string}    sLockName - an optional lock name
         * @return  {boolean}   whether the attempt was successful
         */
        lock: lock,

        /**
         * Releases a lock with the given name. This will warn (in dev) if you try to release a lock that hasn’t been defined.
         *
         * @param   {string}    sLockName - an optional lock name to remove
         * @return  {void}
         */
        unlock: unlock,
        release: unlock,

        /**
         * Wrapper for lock() which runs a callback function only if the named lock is not present.
         *
         * @param   {function}  fCallback - the function to call
         * @param   {string}    sLockName - an optional lock name
         * @return  {boolean}   whether or not the lock was successful
         */
        if: (fCallback, sLockName = DEFAULT_LOCK_NAME) =>
        {
            if (!lock(sLockName))
            {
                return false;
            }
            fCallback();
            return true;
        },

        /**
         * Queues a function for running once a lock has been released.
         *
         * @param   {function}  fCallback - the function to queue
         * @param   {string}    sLockName - an optional lock name
         * @return  {void}
         */
        queue: (fCallback, sLockName = DEFAULT_LOCK_NAME) =>
        {
            // if we don’t have a lock, run immediately.
            if (!setup(sLockName, false))
            {
                fCallback();
                return;
            }

            // otherwise, drop it onto the queue
            aQueue.push({
                sLock: sLockName,
                fCb: fCallback
            });
            return;
        }
    };
}());
