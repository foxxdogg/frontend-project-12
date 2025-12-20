import { useEffect, useRef } from 'react'
import { useFormikContext } from 'formik'

const FocusOnError = () => {
  const { errors, submitCount, isSubmitting } = useFormikContext()
  const lastSubmitCount = useRef(0)

  useEffect(() => {
    if (submitCount > lastSubmitCount.current && !isSubmitting) {
      lastSubmitCount.current = submitCount

      const firstErrorField = Object.keys(errors)[0]
      const el = document.querySelector(`[name="${firstErrorField}"]`)
      if (el) {
        el.focus()
      }
    }
  }, [errors, submitCount, isSubmitting])

  return null
}

export default FocusOnError
