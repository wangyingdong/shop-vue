export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.sessionStorage.setItem(key, value)
}

export const getItem = (key) => {
  const data = window.sessionStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const removeItem = (key) => {
  window.sessionStorage.removeItem(key)
}

export const removeAllItem = () => {
  window.sessionStorage.clear()
}
