export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsDataURL(file)
  })
