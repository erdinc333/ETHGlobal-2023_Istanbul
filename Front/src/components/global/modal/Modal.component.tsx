import { useRef } from 'react'
import './Modal.scss'

type TProps = {
  children: React.ReactNode,
  open: boolean
  setOpen: (value: boolean) => void
}

export function Modal({ children, open, setOpen }: TProps) {
  const backgroundRef = useRef(null)

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (e.target !== backgroundRef.current) return

    e.preventDefault()
    setOpen(false)
  }

  return (
    <>
      <div ref={backgroundRef} className={ open ? 'opened background' : 'background' } onClick={handleClick}>
        <div className="modal">

          { children }

        </div>
      </div>
    </>
  )
}