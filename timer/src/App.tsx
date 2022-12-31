import { useState } from 'react'
import { Button } from './components/Button'

export function App() {

  return (
    <div>
      <Button variant='primary'/>
      <Button variant='secondary'/>
      <Button variant='danger'/>
      <Button/>
    </div>
  )
}
