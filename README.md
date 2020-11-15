# Tappify.js
A lightweight zero dependency [React.js](https://github.com/facebook/react) library to handle the client's pointer. Easily detect client cursor type and hide/show html or perform custom logic! <img align="right" src="https://i.imgur.com/WObyHD5.gif" width="400"/>

## Install

```shell
npm i tappify
```

## Getting started
Everything inside `<Tappify.Finger>` will __show__ when client's pointer is finger (coarse) otherwise __hide__. Respectively `<Tappify.Cursor>` will __show__  when client's pointer is __mouse cursor__ (fine) otherwise __hide__.
```jsx
import Tappify from "tappify";

function myComponent() {
  return <>
    <Tappify.Finger>
      Client is using finger 👉 *tap tap*
    </Tappify.Finger>

    <Tappify.Cursor>
      Client is using mouse cursor 🖱️ *click click*
    </Tappify.Cursor>
  </>
}
```
### Get the current pointer type
```js
const isCursor = Tappify.isCursor(); // will be true if the pointer is mouse cursor. False if it's finger
```
### Subscribe to pointer change
```js
const unsubscribe = Tappify.subscribe(isCursor => {

  if (isCursor) console.log("This client is now using a cursor");
  else console.log("This client is now using a touch screen");
  
});

unsubscribe(); // it's strongly recommended to unsubscribe when component unmounts to avoid memory leaks
```
## Why Tappify?
With growing usage of touch screens on computer devices Tappify makes it seamless and easy to detect when user goes in or out of touch mode. In addition tappify provides an easy to use switch case scenario to handle different HTML elements depending on what pointer the client is using.

Tappify is completely event driven, that means no clocks/setintervals/requestAnimationFrame making it very preferment. It makes use of css's native @media condition to avoid any edge case bugs that JavaScript solutions might invoke.
## How Tappify works
Tappify uses [@media pointer rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@media) to determine the pointer type. If a pointer change is detected the pointerChange event will be dispatched on window and thereafter notifying subscribers and updating the `<Tappify.Cursor>` and `<Tappify.Finger>` components.
## Found an issue?
Please open a new issue on the [Github repository](https://github.com/asplunds/tappify/issues)
## Want to contribute?
Simply create a new pull request on the pull requests tab.
## Browser support
Tappify will work on all modern browsers. Tappify will __not__ work on IE.
