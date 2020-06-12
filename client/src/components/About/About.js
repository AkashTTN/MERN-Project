import React from 'react'

import Cards from '../Cards/Cards'

import './About.css'
import logo from '../../assets/images/ttn-logo-transparent.png'
import CustomerSuccess from '../../assets/images/CustomerSuccess.png'
import Transparency from '../../assets/images/Transparency.png'
import Agility from '../../assets/images/Agility.png'
import EntrepreneurialSpirit from '../../assets/images/EntrepreneurialSpirit.png'
import ConstantLearning from '../../assets/images/ConstantLearning.png'
import CreativityInnovation from '../../assets/images/CreativityInnovation.png'

const CardsContent = [
    {
        image: Transparency,
        title: 'Transparency',
        content: 'Transparency and honesty in whatever we do and say'
    },
    {
        image: CustomerSuccess,
        title: 'Customer Success',
        content: 'Customer success is more important than anything else'
    },
    {
        image: Agility,
        title: 'Agility',
        content: 'Speed and Agility in all our actions'
    },
    {
        image: EntrepreneurialSpirit,
        title: 'Entrepreneurial spirit',
        content: 'Spirit of entrepreneurship defines us'
    },
    {
        image: ConstantLearning,
        title: 'Constant Learning',
        content: 'Pushing ourselves for constant learning'
    },
    {
        image: CreativityInnovation,
        title: 'Creativity and Innovation',
        content: 'Thinking outside the box'
    },
]

const About = () => {
    return (
        <div className="About">
            <div className="BannerImage mb-15">
                <a href="/">
                    <img src={logo} alt="logo"></img>
                </a>
            </div>
            <h1 className="heading">About Us</h1>
            <div className="ContentContainer">
                <section className="ContentSection mb-15">

                    <h2 className="sub-heading mb-15">Who we are ?</h2>
                    <p className="content mb-15">
                        TO THE NEW is a premium digital technology company that provides
                        end-to-end Product Engineering and Digital Transformation services
                        to Fortune 500 companies and Silicon Valley startups across the globe.
                </p>
                    <p className="content mb-15">
                        We cover the entire gamut of product engineering including user
                        experience design, web & mobile application development, cloud,
                        devOps, big data, testing and infrastructure managed services to
                        transform businesses digitally. At TO THE NEW, design led engineering
                        is at the core of our offerings. Some of the cutting-edge technologies,
                        frameworks and platforms we work on include MEAN, Grails, IoT,
                        Blockchain, Bootstrap, AEM, Drupal, Hadoop, AWS, React, Ionic, Roku,
                        iOS, and Android.
                </p>
                    <p className="content mb-15">
                        The DNA of our Product Engineering services include design led
                        engineering, cloud-native development, microservices driven
                        architecture, DevOps, & CICD-led processes.
                        Being an Agile company, we respond to change and pivot fast to
                        create the best market fit with a quick turnaround time.
                </p>
                </section>
                <section className="ContentSection">
                    <h2 className="sub-heading mb-15">What do we stand for ?</h2>
                    <Cards data={CardsContent} />
                </section>
            </div>
        </div>
    )
}

export default About