import React from 'react'
import { useFormStatus } from 'react-dom'
function AuthSubmitButton() {
    const { pending } = useFormStatus()
    
  return (
    <button type="submit" disabled={pending} className="auth-submit-button">
      {pending ? "Submitting..." : "Submit"}
    </button>
  )
}

export default AuthSubmitButton