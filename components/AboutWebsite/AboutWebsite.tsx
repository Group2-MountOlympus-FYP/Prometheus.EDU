'use client'

import classes from './AboutWebsite.module.css'
import { GradientText } from "../GradientText/GradientText"
import { Grid } from '@mantine/core'
import { getText } from './AboutWebsiteLanguage'

export function AboutWebSite(props: React.HTMLAttributes<HTMLDivElement>){
    return (
        <div {...props}>
            <div className={classes.bgImg}>
                <div className={classes.bgLight}></div>
                <div className={classes.iconImg}></div>

                <div className={classes.intro}>
                    <div style={{ 
                        fontWeight: 'bolder', 
                        fontSize: '2.3vw',
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center',
                    }}>
                        <span>{getText('welcome1')}</span>
                        <div style={{ paddingLeft: '0.6vw' }}><GradientText>{getText('education')}</GradientText></div>
                        <span style={{ paddingLeft: '0.6vw' }}>{getText('welcome2')}</span>
                    </div>

                    <div style={{ fontSize: '1vw', marginTop: '1.5vw', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '0.5vw' }}>
                            <span style={{ fontWeight: 'bolder', color: '#FFDA65' }}>{getText('item1')}</span>
                            <span style={{ color: 'white' }}>{getText('itemIntro1')}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5vw' }}>
                            <span style={{ fontWeight: 'bolder', color: '#FFDA65' }}>{getText('item2')}</span>
                            <span style={{ color: 'white' }}>{getText('itemIntro2')}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5vw' }}>
                            <span style={{ fontWeight: 'bolder', color: '#FFDA65' }}>{getText('item3')}</span>
                            <span style={{ color: 'white' }}>{getText('itemIntro3')}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '1vw' }}>
                        <span style={{ fontSize: '1.2vw', color: 'white' }}>{getText('intro')}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
