'use client'

import { useEffect, useState } from "react"

import { HeartRateStrapData, EmptyDevice } from "./BLEConfig"
import { BLEConnector } from "./BLEDeviceConnector"

export function BLEDisplay(){
    // 使用 useState 管理 bluetooth data
    const [connector, setConnector] = useState<BLEConnector>(new BLEConnector(EmptyDevice))
    const [bluetoothData, setBluetoothData] = useState<any[]>([])

    const getBLEInformation = async (deviceType:any) => {
        let server
        const connector = new BLEConnector(HeartRateStrapData)
        server = await connector.EstablishBLEConnection(deviceType)
        if(server != null){
            setConnector(connector)
            connector.GetCharacteristicsAndParse(server, deviceType)
        }
    }

    //当connector建立成功连接后，使用useEffect来动态监听数据变化
    useEffect(() => {
        if(!connector) return
        //请阅数据变化，并获取取消订阅函数
        const unsubscribe = connector.subscribeDataUpdate((data: any) => 
        {
            setBluetoothData([...data])
        })

        return () => {
            //退出时取消订阅
            unsubscribe()
        }
    }, [connector])
    return (
        <div>
            <button onClick={() => getBLEInformation(HeartRateStrapData)}>Heartbeat test</button>
            <section>
            <ol>
                <li>HeartRate: { bluetoothData.length > 0 ? bluetoothData[0] + " BPM" : "loading..."}</li>
                <li>BatteryLevel: { bluetoothData.length > 0 ? bluetoothData[1] + "%": "loading..." }</li>    
            </ol>
            </section>
        </div>
    )
}