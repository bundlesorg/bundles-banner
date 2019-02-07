# Bundles Banner Bundler

<!-- Shields. -->
<p>
    <!-- NPM version. -->
    <a href="https://www.npmjs.com/package/@bundles/bundles-banner"><img alt="NPM version" src="https://img.shields.io/npm/v/@bundles/bundles-banner.svg?style=flat-square"></a>
    <!-- NPM downloads/month. -->
    <a href="https://www.npmjs.com/package/@bundles/bundles-banner"><img alt="NPM downloads per month" src="https://img.shields.io/npm/dm/@bundles/bundles-banner.svg?style=flat-square"></a>
    <!-- Travis branch. -->
    <a href="https://github.com/brikcss/bundles-banner/tree/master"><img alt="Travis branch" src="https://img.shields.io/travis/rust-lang/rust/master.svg?style=flat-square&label=master"></a>
    <!-- Codacy. -->
    <a href="https://www.codacy.com/app/thezimmee/bundles-banner"><img alt="Codacy code grade" src="https://img.shields.io/codacy/grade/d73d51dfa99743149e364d721eb3aaad/master.svg?style=flat-square"></a>
    <a href="https://www.codacy.com/app/thezimmee/bundles-banner"><img alt="Codacy coverage" src="https://img.shields.io/codacy/coverage/d73d51dfa99743149e364d721eb3aaad/master.svg?style=flat-square"></a>
    <!-- Coveralls -->
    <a href='https://coveralls.io/github/brikcss/bundles-banner?branch=master'><img src='https://img.shields.io/coveralls/github/brikcss/bundles-banner/master.svg?style=flat-square' alt='Coverage Status' /></a>
    <!-- JS Standard style. -->
    <a href="https://standardjs.com"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square"></a>
    <!-- Prettier code style. -->
    <a href="https://prettier.io/"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
    <!-- Semantic release. -->
    <a href="https://github.com/semantic-release/semantic-release"><img alt="semantic release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square"></a>
    <!-- Commitizen friendly. -->
    <a href="http://commitizen.github.io/cz-cli/"><img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square"></a>
    <!-- MIT License. -->
    <a href="https://choosealicense.com/licenses/mit/"><img alt="License" src="https://img.shields.io/npm/l/express.svg?style=flat-square"></a>
    <!-- Greenkeeper. -->
    <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/brikcss/bundles-banner.svg?style=flat-square" alt="Greenkeeper badge"></a>
</p>

This is a bundler plugin for use with [Bundles](https://github.com/brikcss/bundles-core). `bundles-banner` prepends a file banner to the content for specified files.

## Environment support

| Node | CLI | ES Module | Browser | UMD |
| :--: | :-: | :-------: | :-----: | :-: |
|  ✓   |  ✓  |     ✓     |    x    |  x  |

## Install

Make sure [Bundles is installed](https://github.com/brikcss/bundles-core#install).

```sh
npm install @bundles/bundles-banner -D
```

## Usage

See [configuring Bundles](https://github.com/brikcss/bundles-core#configuration) for how to configure Bundles and bundlers.

### Configuration

The following properties are available in **`bundler.options`**:

- `include` _{String[]|Function}_ (`['.js', '.css']`) Determines whether filepath should include a banner. If String Array matches the file extension, or if a Function returns `true`, a banner is added.
- `prefix` _{String}_ (`'/*! '`) Banner prefix.
- `suffix` _{String}_ (`' */'`) Banner suffix.
- `metadata` _{String[]|Array[]|Function|Function[]}_ (`['author', 'reference']`) Metadata to add to banner. Each item in the Array represents a parameter name, and the value of the parameter. Each item can be a String, an Array where item[0] is the parameter's name and item[1] is the value, or a Function which returns a String or Array. See example below.
- `joinWith` _{String}_ (`' | '`) Character(s) to join `metadata` with.
- `paramNameChar` _{String}_ (`'@'`) Character(s) to prepend parameter name with.

### Example

```js
const bundle = {
    input: [...],
    bundlers: [{
        run: '@bundles/bundles-banner',
        include: ['.js'],
        // Metadata can be String, Array, or Function.
        metadata: ['author', ['my-param', 'This is my param.', (file) => {
            if (file.data.myProp) return ['custom-param', 'Value is ' + file.data.myProp]
            return false
        }]],
        joinWith: ' - '
    }]
}
```

Assuming the following data:

```yaml
author: Snoopy
myProp: true
```

the above example will return:

```js
/*! @author Snoopy - @my-param This is my param. - @custom-param Value is true */
```
