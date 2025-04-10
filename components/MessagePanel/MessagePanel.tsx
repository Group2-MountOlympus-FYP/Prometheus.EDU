'use client'
import { useState, useEffect } from "react"
import './MessagePanel.css'
import { getText } from "./MessageLang"
import { IoCloseSharp } from "react-icons/io5";

type msgPanelProps = {
    onExitClick?:() => void
}

export function MessagePanel({onExitClick = () => {}} : msgPanelProps){

    useEffect(() => {
        
    }, [])

    return (
        <div style={{width: '100%'}}>
            <div className='exit-button'>
                <IoCloseSharp id="exitbutton" size={28} onClick={onExitClick}></IoCloseSharp>
            </div>
        <div className="msgPanel-bg">
            <div className="msgTitle">
                <span className="message">{getText('message')}</span>
            </div>

            <table>
                <tbody>
                    <tr>
                        <td colSpan={3}>
                            <span>some messages</span>
                        </td>
                    </tr>

                </tbody>
            </table>
            <div className="placeholder"></div>

        </div>
        </div>
      );

    
}