function convertArrayBufferToString (buffer) {
  // return String.fromCharCode.apply(null, arrayBuffer)
  return buffer.toString('utf-8')
}

module.exports = convertArrayBufferToString
