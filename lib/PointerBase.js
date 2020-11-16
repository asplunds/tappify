import React, { useState, useEffect } from "react";

let isCursor = null;


// Define these globally to reduce risk of accidentally creating more event listeners
window.addEventListener("resize", checkIsCursor);
["mouseover", "pointerdown"].forEach(v => document.addEventListener(v, checkIsCursor));

checkIsCursor();


/**
 * Determine if client is using a cursor or a pointer
 * @returns { Boolean } true -> client uses a mouse cursor, false -> client uses finger/stylus
 */
export const cursor = () => {

    // Cross browser short solution to check whether it's a phone or screen.
    // https://stackoverflow.com/a/13470899
    const supportTouch = 'ontouchstart' in window || navigator.maxTouchPoints;

    return supportTouch;

}



/**
 * Subscribe to pointer change, provide a callback to be called when the pointer changes
 * @param { function } callback - The callback function which is invoked when pointer changes, returns boolean. true -> client uses a mouse cursor, false -> client uses finger/stylus
 * @returns { function } unsubscribe function 
 */
export const subscribe = callback => {

    const generatedCallback = ({ detail }) => {
        callback(detail);
    }

    window.addEventListener("pointerChange", generatedCallback);


    /**
     * Unsubscribe the instance
     * @returns undefined
     */
    const unsubscribe = () =>
        window.removeEventListener("pointerChange", generatedCallback);

    return unsubscribe;

}



function checkIsCursor() {

    const result = cursor();

    if (result === isCursor) return;

    isCursor = result;

    window.dispatchEvent(new CustomEvent("pointerChange", { detail: isCursor }));
    
}


const hide = (isCursor, type) => type === "CURSOR" ? isCursor : !isCursor;

export default type => function PointerBase(props) {

    const [ hidden, setHidden ] = useState(hide(isCursor, type));

    useEffect(() => {

        const updateComponentVisibility = ({ detail }) => setHidden(hide(detail, type));

        window.addEventListener("pointerChange", updateComponentVisibility);

        return () => {
            window.removeEventListener("pointerChange", updateComponentVisibility);
        }

    }, [ setHidden ]);

    return hidden ? props.children : null;

}


