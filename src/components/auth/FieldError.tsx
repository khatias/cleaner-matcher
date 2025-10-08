import React from 'react'

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <small id={id} style={{ color: "crimson", display: "block", marginTop: 4 }}>
      {msg}
    </small>
  )
}

export default FieldError