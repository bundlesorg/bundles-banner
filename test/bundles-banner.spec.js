/* eslint-env jest */
const log = require('loglevel')
const bundle = require('@bundles/core')
const banner = require('../lib/bundles-banner.js')

// Set loglevel here so jest doesn't output anything.
log.setLevel('silent')

test('prepend banner', () => {
  expect.assertions(3)
  return bundle({
    bundles: [{
      id: 'test',
      input: {
        path: 'test.js',
        content: '---\nauthor: Brikcss <https://github.com/brikcss>\nreference: <https://github.com/brikcss/bundles-banner>'
      },
      bundlers: [banner]
    }]
  }).then(result => {
    const output = result.bundles[0].output[0]
    expect(result.success).toBe(true)
    expect(output.data).toMatchObject({
      author: 'Brikcss <https://github.com/brikcss>',
      reference: '<https://github.com/brikcss/bundles-banner>'
    })
    expect(output.content).toBe('/*! test.js | @author Brikcss <https://github.com/brikcss> | @reference <https://github.com/brikcss/bundles-banner> */\n\n')
  })
})

test('prepend banner with options', () => {
  expect.assertions(5)
  const bundlers = [{ run: banner,
    options: {
      include: ['.js'],
      prefix: '/**\n * ',
      suffix: '\n */',
      joinWith: '\n * ',
      metadata: ['author', ['@something', 'It\'s really cool.'], 'reference']
    } }]
  return bundle({
    bundles: [{
      id: 'test2',
      input: {
        path: 'test2.js',
        content: '---\nauthor: Brikcss <https://github.com/brikcss>\nreference: <https://github.com/brikcss/bundles-banner>'
      },
      bundlers
    }, {
      id: 'test3',
      input: {
        path: 'test3.md',
        content: '# Title\n\nHello world!\n'
      },
      bundlers
    }]
  }).then(result => {
    expect(result.success).toBe(true)
    expect(result.bundles[0].output[0].data).toMatchObject({
      author: 'Brikcss <https://github.com/brikcss>',
      reference: '<https://github.com/brikcss/bundles-banner>'
    })
    expect(result.bundles[0].output[0].content).toBe('/**\n * test2.js\n * @author Brikcss <https://github.com/brikcss>\n * @something It\'s really cool.\n * @reference <https://github.com/brikcss/bundles-banner>\n */\n\n')
    expect(result.bundles[1].output[0].data).toMatchObject({})
    expect(result.bundles[1].output[0].content).toBe('# Title\n\nHello world!\n')
  })
})
