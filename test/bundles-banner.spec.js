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
      id: 'simple',
      input: {
        path: 'simple.js',
        content: '---\nauthor: \'Brikcss <https://github.com/brikcss>\'\nreference: \'<https://github.com/brikcss/bundles-banner>\''
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
    expect(output.content).toBe('/*! simple.js | @author Brikcss <https://github.com/brikcss> | @reference <https://github.com/brikcss/bundles-banner> */\n\n')
  })
})

test('make sure data.metadata gets precedence', () => {
  expect.assertions(3)
  return bundle({
    bundles: [{
      id: 'data.metadata',
      input: {
        path: 'metadata.js',
        content: '---\nauthor: \'Testing\'\nmetadata:\n  author: \'Brikcss <https://github.com/brikcss>\'\n  reference: \'<https://github.com/brikcss/bundles-banner>\''
      },
      bundlers: [banner]
    }]
  }).then(result => {
    const output = result.bundles[0].output[0]
    expect(result.success).toBe(true)
    expect(output.data).toMatchObject({
      author: 'Testing',
      metadata: {
        author: 'Brikcss <https://github.com/brikcss>',
        reference: '<https://github.com/brikcss/bundles-banner>'
      }
    })
    expect(output.content).toBe('/*! metadata.js | @author Brikcss <https://github.com/brikcss> | @reference <https://github.com/brikcss/bundles-banner> */\n\n')
  })
})

test('metadata as a function', () => {
  expect.assertions(3)
  return bundle({
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
    const output = result.bundles[0].output[0]
    expect(result.success).toBe(true)
    expect(output.data).toMatchObject({
      author: 'Testing',
      metadata: {
        author: 'Brikcss <https://github.com/brikcss>',
        reference: '<https://github.com/brikcss/bundles-banner>'
      }
    })
    expect(output.content).toBe('/*! function.js | @author Brikcss <https://github.com/brikcss> | @reference <https://github.com/brikcss/bundles-banner> | @my-test-param My test data. */\n\n')
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
    expect(result.bundles[0].output[0].data).toMatchObject({
      author: 'Brikcss <https://github.com/brikcss>',
      reference: '<https://github.com/brikcss/bundles-banner>'
    })
    expect(result.bundles[0].output[0].content).toBe('/**\n * options1.js\n * @author Brikcss <https://github.com/brikcss>\n * @something It\'s really cool.\n * @reference <https://github.com/brikcss/bundles-banner>\n */\n\n')
    expect(result.bundles[1].output[0].data).toMatchObject({})
    expect(result.bundles[1].output[0].content).toBe('# Title\n\nHello world!\n')
  })
})
