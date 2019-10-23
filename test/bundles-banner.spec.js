/* eslint-env jest */
const log = require('loglevel')
const bundle = require('@bundles/core')
const banner = require('../lib/bundles-banner.js')

// Set loglevel here so jest doesn't output anything.
log.setLevel('silent')

test('prepend banner', () => {
  expect.assertions(3)
  return bundle.run({
    bundles: [{
      id: 'simple',
      input: {
        path: 'simple.js',
        content: '---\nauthor: \'Brikcss <https://github.com/brikcss>\'\nreference: \'<https://github.com/brikcss/bundles-banner>\''
      },
      bundlers: [banner]
    }]
  }).then(result => {
    const output = result.bundles[0].output
    expect(result.success).toBe(true)
    expect(output.size).toBe(1)
    expect(output.get('simple.js')).toMatchObject({
      data: {
        author: 'Brikcss <https://github.com/brikcss>',
        reference: '<https://github.com/brikcss/bundles-banner>'
      },
      content: '/*! simple.js | @author Brikcss <https://github.com/brikcss> | @reference <https://github.com/brikcss/bundles-banner> */\n\n'
    })
  })
})

test('make sure data.metadata gets precedence', () => {
  expect.assertions(3)
  return bundle.run({
    bundles: [{
      id: 'data.metadata',
      input: {
        path: 'metadata.js',
        content: '---\nauthor: \'Testing\'\nmetadata:\n  author: \'Brikcss <https://github.com/brikcss>\'\n  reference: \'<https://github.com/brikcss/bundles-banner>\''
      },
      bundlers: [banner]
    }]
  }).then(result => {
    const output = result.bundles[0].output
    expect(result.success).toBe(true)
    expect(output.size).toBe(1)
    expect(output.get('metadata.js')).toMatchObject({
      data: {
        author: 'Testing',
        metadata: {
          author: 'Brikcss <https://github.com/brikcss>',
          reference: '<https://github.com/brikcss/bundles-banner>'
        }
      },
      content: '/*! metadata.js | @author Brikcss <https://github.com/brikcss> | @reference <https://github.com/brikcss/bundles-banner> */\n\n'
    })
  })
})

test('metadata as a function', () => {
  expect.assertions(3)
  return bundle.run({
    bundles: [{
      id: 'metadata.function',
      input: {
        path: 'function.js',
        content: '---\ntest: \'Test data.\'\nauthor: \'Testing\'\nmetadata:\n  author: \'Brikcss <https://github.com/brikcss>\'\n  reference: \'<https://github.com/brikcss/bundles-banner>\''
      },
      bundlers: [{
        run: banner,
        options: {
          metadata: [
            'author',
            'reference',
            (file) => {
              if (file.data.test) return ['my-test-param', 'My test data.']
            }
          ]
        }
      }]
    }],
    data: {}
  }).then(result => {
    const output = result.bundles[0].output
    expect(result.success).toBe(true)
    expect(output.size).toBe(1)
    expect(output.get('function.js')).toMatchObject({
      data: {
        author: 'Testing',
        metadata: {
          author: 'Brikcss <https://github.com/brikcss>',
          reference: '<https://github.com/brikcss/bundles-banner>'
        }
      },
      content: '/*! function.js | @author Brikcss <https://github.com/brikcss> | @reference <https://github.com/brikcss/bundles-banner> | @my-test-param My test data. */\n\n'
    })
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
  return bundle.run({
    bundles: [{
      id: 'options1',
      input: {
        path: 'options1.js',
        content: '---\nauthor: Brikcss <https://github.com/brikcss>\nreference: <https://github.com/brikcss/bundles-banner>'
      },
      bundlers
    }, {
      id: 'options2',
      input: {
        path: 'options2.md',
        content: '# Title\n\nHello world!\n'
      },
      bundlers
    }]
  }).then(result => {
    expect(result.success).toBe(true)
    expect(result.bundles[0].output.size).toBe(1)
    expect(result.bundles[0].output.get('options1.js')).toMatchObject({
      data: {
        author: 'Brikcss <https://github.com/brikcss>',
        reference: '<https://github.com/brikcss/bundles-banner>'
      },
      content: '/**\n * options1.js\n * @author Brikcss <https://github.com/brikcss>\n * @something It\'s really cool.\n * @reference <https://github.com/brikcss/bundles-banner>\n */\n\n'
    })
    expect(result.bundles[1].output.size).toBe(1)
    expect(result.bundles[1].output.get('options2.md')).toMatchObject({
      data: {},
      content: '# Title\n\nHello world!\n'
    })
  })
})
