import React from 'react'

import Cards from '../Cards/Cards'

import './Help.css'
import logo from '../../assets/images/ttn-logo-transparent.png'

const Offices = [
    {
        title: 'NOIDA',
        content: '2nd Floor, NSL Techzone SEZ, Noida-Greater Noida Expressway, Sector 144, Noida, Uttar Pradesh 201301, India'
    },
    {
        title: 'USA',
        content: 'TO THE NEW INC 101 Hudson Street #2100 Jersey City, NJ 07302'
    },
    {
        title: 'DUBAI',
        content: 'Sentro Business Center, Office No:1107 The Onyx, Tower 2, The Greens, Sheikh Zayed Road, Dubai, U.A.E'
    },
]

const Help = () => {
    return (
        <div className="Help">
            <div className="BannerImage mb-15">
                <a href="/">
                    <img src={logo} alt="logo"></img>
                </a>
            </div>
            <h1 className="heading">Reach out to us</h1>
            <div className="ContentContainer">
                <section className="Offices ContentSection">
                    <h3 className="heading fs-30">Offices</h3>
                    <Cards data={Offices} />
                </section>
                <section className="Email ContentSection">
                    <i className="fas fa-envelope fa-5x"></i>
                    <p className="EmailText fs-30">Write to Us</p>
                    <div>
                        <a href="mailto:sales@tothenew.com" className="mb-15">
                            sales@tothenew.com
                        </a>
                    </div>
                </section>
                <section className="SocialMedia ContentSection">
                    <p className="EmailText fs-30 text-center">Connect with Us</p>
                    <ul className="SocialMediaList">
                        <li className="SocialMediaListItem">
                            <a
                                href="https://www.facebook.com/TOTHENEWDigital/"
                                target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-facebook-f fa-2x"></i>
                            </a>
                        </li>
                        <li className="SocialMediaListItem">
                            <a href="https://twitter.com/tothenew"
                                target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-twitter fa-2x"></i>
                            </a>
                        </li>
                        <li className="SocialMediaListItem">
                            <a href="https://www.linkedin.com/company/tothenew"
                                target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-linkedin-in fa-2x"></i>
                            </a>
                        </li>
                        <li className="SocialMediaListItem">
                            <a href="https://www.youtube.com/c/tothenew"
                                target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-youtube fa-2x"></i>
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </div >
    )
}

export default Help
