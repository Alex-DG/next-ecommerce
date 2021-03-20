import { useState } from 'react'

const useForm = (initial = {}) => {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial)

  const handleChange = (e) => {
    let { value, name, type, files } = e.target

    if (type === 'number') value = parseInt(value)
    if (type === 'file') [value] = files

    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const resetForm = () => setInputs(initial)

  const clearForm = () => {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, _]) => [key, ''])
    )

    setInputs(blankState)
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  }
}

export default useForm
