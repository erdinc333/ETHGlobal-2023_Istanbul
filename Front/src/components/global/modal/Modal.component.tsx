import './Modal.scss'

type TProps = {
  children: React.ReactNode
}

export function Modal({ children }: TProps) {
  return (
    <>
      <div className="background">
        <div className="modal">

          { children }

        </div>
      </div>
    </>
  )
}