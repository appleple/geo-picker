# OpenMapEditor

## Screenshot

![](./screenshot.png)

## Demo

[https://rawgit.com/appleple/openmap-editor/master/test/index.html](https://rawgit.com/appleple/openmap-editor/master/test/index.html)

## Usage

```js
const editor = new OpenMapEditor('.js-map-editor');
```

# Method

update pin location

```js
editor.updatePin({lat, lng, zoom});
```

destroy the editor

```js
editor.destroy();
```

