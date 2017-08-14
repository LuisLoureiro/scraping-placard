module.exports = function convertArrayBufferToString (buffer) {
  // return String.fromCharCode.apply(null, arrayBuffer)
  return buffer.toString('utf-8')
}
