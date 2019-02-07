/*! bundles-banner.js | @author brikcss <https://github.com/brikcss> | @reference https://github.com/brikcss/bundles-banner */

import path from 'path'

export default (bundle = {}, bundler = {}) => {
  // Set default options.
  const options = bundler.options = Object.assign({
    include: ['.js', '.css'],
    prefix: '/*! ',
    suffix: ' */',
    paramNameChar: '@',
    joinWith: ' | ',
    metadata: ['author', 'reference']
  }, bundler.options)
  // Iterate through each output file.
  bundle.output.forEach((file, i) => {
    // Only add banner if file extension matches `include`.
    if (
      (typeof options.include === 'function' && !options.include(file, bundle)) ||
      !options.include.includes(path.extname(file.source.path))
    ) { return }
    // Convert `metadata` to Array of Strings.
    if (!(options.metadata instanceof Array)) options.metadata = [options.metadata]
    const banner = options.metadata.map(item => {
      if (typeof item === 'function') {
        item = item(file)
        if (!item) return
      }
      if (item instanceof Array) {
        if (item[0].charAt(0) !== options.paramNameChar) item[0] = options.paramNameChar + item[0]
        item = item.join(' ')
      } else if (typeof item === 'string') {
        const value = file.data.metadata && item in file.data.metadata ? file.data.metadata[item] : file.data[item]
        if (!value) return
        item = options.paramNameChar + item + ' ' + value
      }
      return item
    })
    // Add file name.
    banner.unshift(path.basename(file.source.path))
    // Prepend banner to content.
    file.content = options.prefix + banner.join(options.joinWith) + options.suffix + '\n\n' + file.content
  })
  // Once all promises resolve, return the bundle.
  return bundle
}
