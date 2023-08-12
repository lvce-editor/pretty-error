# Pretty Error

Create user friendly error messages and code frames for errors.

## Install

```sh
npm install @lvce-editor/pretty-error
```

## Usage

```js
import * as PrettyError from '@lvce-editor/pretty-error'

const error = new TypeError(`x is not a function`)

const prettyError = PrettyError.prepare(error)
```

## Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/lvce-editor/pretty-error)
