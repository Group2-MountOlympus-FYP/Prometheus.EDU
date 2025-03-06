'use client'

import classes from './AboutWebsite.module.css'
import { Grid } from '@mantine/core'
import { getText } from './AboutWebsiteLanguage'

export function AboutWebSite(props: React.HTMLAttributes<HTMLDivElement>){
    return (
        <div {...props}>
            <div className={classes.bgImg}>
                <div className={classes.intro}>
                    <span style={{fontWeight:'bolder', fontSize:'38px', display:'block'}}>{getText('welcome')}</span>
                    <span style={{fontSize:'20px'}}>{getText('intro')}</span>
                    {/* <p>Our website, Prometheus.EDU, is a comprehensive online education platform designed to 
                        provide equitable learning opportunities for underprivileged and restricted communities. 
                        Developed in collaboration with the global charity NGO Agape, the platform features three 
                        key components: NousTube, an online video course service for structured learning; MetisHub, 
                        a community forum for peer interaction and support; and AthenaTutor, an AI-powered chatbot 
                        that provides real-time assistance by referencing course materials. Built with modern technologies 
                        like React, Next.js, Flask, and LangChain, Prometheus.EDU is scalable, user-friendly, and accessible, 
                        ensuring that learners from diverse backgrounds can access high-quality education and support.</p> */}
                </div>
            </div>
            <div >
                
            </div>
        </div>
    )
}