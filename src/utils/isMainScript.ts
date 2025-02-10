export const regexRemoveExtension = /\.[^.]*$/

export const isSameFile = (fileA: string, fileB: string): boolean => {
  const fileANoExtension = fileA.replace(regexRemoveExtension, '')

  const fileBNoExtension = fileB.replace(regexRemoveExtension, '')

  return fileANoExtension === fileBNoExtension
}

export const isMainScript = (filePath: string): boolean => {
  if (typeof require !== 'undefined' && require.main) {
    // CommonJS environment
    return require.main.filename === filePath
  }

  return false
}
