import { NavLink } from 'react-router-dom'
import './EventResume.scss'

type TProps = {
  event: TEvent
}

export function EventResume({ event }: TProps) {
  const hasCoverPicture = !!event.picturesURL[0]

  return (
    <>
      <NavLink to={`/events/${event.id}`} className="event-resume">
        <div className="block">
          <div className={hasCoverPicture ? 'picture': 'picture no-picture'} style={ { backgroundImage: "url(" + event.picturesURL[0] + ")" } }></div>
          <div className="content">
            <div className="text">
              <small>{event.location}</small>
              <div className="header">
                <h3 className="title">{ event.title }</h3>
                <small>{ event.dateTimeRange.begin.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: "numeric"}) } - { event.dateTimeRange.end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: "numeric"}) }</small>
              </div>
              <p className="description">{ event.description }</p>
            </div>
            <div className="btn-wrapper">
              <button className="btn action">Check Out</button>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  )
}