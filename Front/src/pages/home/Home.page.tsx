import { NavLink } from 'react-router-dom'
import { Logo } from '../../components/global/logo/Logo.component'
import './Home.page.scss'

export function Home() {
  return (
    <>
      <section id="home" className="page">
        <div className="catch">
          <div className="titles">
            <div className="title-wrapper">
              <Logo color="action" width={ 300 }/>
              <h3>
                <span>T</span>
                <span>H</span>
                <span>E</span>
                <span> </span>
                <span>P</span>
                <span>L</span>
                <span>A</span>
                <span>C</span>
                <span>E</span>
                <span> </span>
                <span>T</span>
                <span>O</span>
                <span> </span>
                <span>B</span>
                <span>E</span>
                </h3>
            </div>
          </div>
        </div>

        <div className="presentation">
          <h2>Your ticket to every event, secured</h2>
          <button className="btn action"><NavLink to="/events">Get your ticket</NavLink></button>
        </div>
      </section>
    </>
  )
}