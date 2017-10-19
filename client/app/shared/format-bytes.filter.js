export function formatBytes () {
  return function (bytes) {
    if (bytes === 0) {
      return '0 Bytes'
    }
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
      return '-'
    }
    const availableUnits = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
    const unit = Math.floor(Math.log(bytes) / Math.log(1024))
    const val = (bytes / Math.pow(1024, Math.floor(unit))).toFixed(2)

    return `${val.match(/\.0*$/) ? val.substr(0, val.indexOf('.')) : val} ${availableUnits[unit]}`
  }
}

export function megaBytes () {
  return function (bytes) {
    return bytes * 1024 * 1024
  }
}
