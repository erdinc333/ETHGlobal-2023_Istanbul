import { NavLink } from 'react-router-dom'
import './EventCard.scss'

type TProps = {
  event: TEvent
}

export function EventCard({ event }: TProps) {
  return (
    <>
      <div className="event-card">
        <div className="text">
          <h3 className="title">{ event.title }</h3>
        </div>
        <button className="btn action"><NavLink to={`/dashboard/${event.id}`}>Manage</NavLink></button>
      </div>
    </>
  )
}