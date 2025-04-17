'use client'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ScrollArea } from '@mantine/core';
import './MessagePanel.css'
import { getText } from "./MessageLanguage"
import { IoCloseSharp } from "react-icons/io5";

// 类型定义
type msgPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    onExitClick?: () => void;
};

export function MessagePanel({ isOpen, onClose, onExitClick = () => {} }: msgPanelProps) {

    const content = Array(100)
        .fill(0)
        .map((_, index) => <p key={index}>Modal with scroll</p>);

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Header is sticky"
            scrollAreaComponent={ScrollArea.Autosize}
        >
            {/* <div className='exit-button'>
                <IoCloseSharp id="exitbutton" size={28} onClick={onExitClick}></IoCloseSharp>
            </div> */}

            {content}

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
        </Modal>
    );
}
