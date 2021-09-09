import React, { useState, useEffect } from "react";

let isCursor = null;

const detector = ((document) => {

    const id = `____DETECT_POINTER`;

    const search = document.getElementById(id);

    if (search) return search

    const body = document.body;

    body.insertAdjacentHTML("afterbegin", `
        <pointer-detector id="${id}"></pointer-detector>
        <style>
            #${id} {
                display: none;
                flex-grow: 1;
            }
            @media (pointer: coarse) {
                #${id} {
                    flex-grow: 0;
                }
            }
        </style>
    `);

    const detector = document.getElementById(id);
    
    window.requestAnimationFrame(() => checkIsCursor(detector));
    
    window.addEventListener("resize", () => checkIsCursor(detector));
    ["mouseover", "pointerdown"].forEach(v => document.addEventListener(v, () => checkIsCursor(detector)));

    return detector;
})

/**
 * Determine if client is using a cursor or a pointer
 * @returns { Boolean } true -> client uses a mouse cursor, false -> client uses finger/stylus
 */
export const cursor = (detector) => {

    const stringBoolean = window.getComputedStyle(detector)["flex-grow"];

    return !!(+stringBoolean);

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



function checkIsCursor(detector) {

    const result = cursor(detector);

    isCursor = result;

    window.dispatchEvent(new CustomEvent("pointerChange", { detail: isCursor }));

}



//checkIsCursor();

const hide = (isCursor, type) => type === "CURSOR" ? isCursor : !isCursor;

const type = type => function PointerBase(props) {

    const [hidden, setHidden] = useState(hide(isCursor, type));

    React.useEffect(() => {
        detector(document);
    }, []);

    useEffect(() => {

        const updateComponentVisibility = ({ detail }) => setHidden(hide(detail, type));

        window.addEventListener("pointerChange", updateComponentVisibility);

        return () => {
            window.removeEventListener("pointerChange", updateComponentVisibility);
        }

    }, [setHidden]);

    return hidden ? props.children : null;

}

export default type;

