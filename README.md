# wechat-preview
[![wechat-preview version](https://img.shields.io/badge/wechat--preview-v1.0.2-brightgreen.svg)](https://github.com/mailmangroup/wechat-preview/) [![License](http://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)

## Introduction
To support WeChat, we had to build a live preview of how the post would look that could be used within our app. This would allow us to simulate and build upon the already existing user experience that WeChat has internally.

## Installation
```
$ bower install wechat-preview
```

## Including wechat-preview
### RequireJS
```javascript
require.config({
    paths: {
        wechatPreview: 'path/to/bower_components/wechat-preview/dist/wechat-preview.min'
    }
});

require( [ 'wechatPreview' ], function( wechatPreview ) {
    ...
});
```
### Basic Script Include
```html
<script src="./bower_components/wechat-preview/dist/wechat-preview.min.js"></script>
```
### Include the CSS File
```html
<link rel="stylesheet" href="./bower_components/wechat-preview/dist/wechat-preview.css">
```

## Usage
```javascript
var preview = new wechatPreview({ build });

// returns preview.el
// document.body.appendChild( preview.el );

preview.generate({ content });
```

## Parameters

### Build

Type: `object`

This will specify the size of the container.

### Content

Type: `object`

This will specify the content of the container

```javascript
content: { ... }
```

## wechatPreview.build Options

### build.container 

Type: `string` or `object`

This will specify the size of the container. This can be set by either a predefined set of screen sizes through a string, or specific pixel heights and widths through an object. i.e.

```javascript
var build = {
    container: {
        height: 736, // 736px (iPhone 6 Plus width) is the maximum accepted height
        width: 414 // 414px (iPhone 6 Plus height) is the maximum accepted width
    }
}
```

Whitelisted screen size strings:

- iPhone 4
- iPhone 5
- iPhone 6
- iPhone 6 Plus

Example of `build.container` as a whitelist iPhone string:

```javascript
var build = container: 'iphone4'
```

## wechatPreview.content Options

### articles

Type: `object`
Default: `null`

This is an array of article objects that each contains post content.

```javascript
content: {
    articles: [
        { ... },
        { ... }
    ]
}
```

### content.postTime
Type: `timestamp`
Default: Current time

This will act as the date the post was published on both the entire post wrapper and each article where the date appears.

```javascript
content: {
    postTime: 1444905243050,
    articles: [
        { ... },
        { ... }
    ]
}
```

## content.article Options

### content.article.shadow

Type: `boolean`
Default: `false`

If set to true, this creates a DOM element in that position that acts as a placeholder, this can be used for creating a position to place items should you be dragging and dropping content into the container.

```javascript
content: {
    articles: [
        { ... }
        { shadow: true },
        { ... }
    ]
}
```

The above example will generate a DOM element in between the two articles.

### content.article.title

Type: `string`

Default: `微博正文`

The article title is the title of each individual article.

### content.article.description

Type: `string`

Default: `摘要`

This will be the description of each individual article, this will only be visible on specific classes of articles.

### content.article.image

Type: `string`

Default: `null`

This is the image URL of the articles featured image.