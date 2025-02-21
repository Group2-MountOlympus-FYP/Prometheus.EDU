'use client'

import { Tabs } from "@mantine/core"
import { useState } from "react"

//用户信息下方切换帖子和收藏的部分

export function TabBar(){
    type Tabs = 'post' | 'collection'

    const [currentTab, setCurrentTab] = useState<Tabs>('post')

    return (
        <div>
            <table>
                <tbody>
                <tr className="tab-bar">
                    <td style={{borderLeft: 1}} onClick={() => setCurrentTab('post')}>Post</td>
                    <td onClick={() => setCurrentTab('collection')}>Collection</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}