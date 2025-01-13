//BluetoothDevice -> BluetoothRemoteGATTServer -> BluetoothRemoteGATTService -> BluetoothRemoteGATTCharacteristic
import { HeartRateDataParser } from "./BLEDataParser"

//蓝牙连接类
export class BLEConnector{
    serviceUUIDs: string[]
    characteristicUUIDs: string[]
    private parsedData: any[]

    //recall function for pages who want to describe the change of the data
    private listeners: ((data:any[]) => void)[] = []

    constructor(deviceType:any) {
        this.serviceUUIDs = deviceType.data.map((item: { serviceUUID: any; }) => item.serviceUUID)
        this.characteristicUUIDs = deviceType.data.map((item: { characteristicUUID: any; }) => item.characteristicUUID)
        this.parsedData = new Array<any>(this.characteristicUUIDs.length)
    }

    subscribeDataUpdate(listener: (data: any[]) => void){
        //将监听器的回调函数加入监听器数组中
        this.listeners.push(listener)
        return () => {
            //返回用于取消订阅的函数
            this.listeners = this.listeners.filter((l) => l !== listener)
        }
    }

    private notifyListeners(){
        //通知所有订阅者数据已更新
        this.listeners.forEach((listener) => listener(this.parsedData))
    }

    getParsedData(){
        return this.parsedData
    }

    //检测当前浏览器是否支持蓝牙设备
    CheckBLEAvailable(){
        if('bluetooth' in navigator){
            console.log("bluetooth is supported by navigaor!")
            return true
        }else{
            alert('Your navigator did not support bluetooth connection!')
            return false
        }
    }

    //获取与蓝牙设备的连接
    async GetBLEConnection(device:any) {
        try{
            const server = await device.gatt.connect()
            console.log("Successfully connect to device!")
            return server
        }catch(error){
            console.log("An error occur when connection device: ", error)
        }
    }

    //请求与蓝牙设备连接
    async RequestBLEConnection(deviceType:any){
        //将service的uuid提取出来
        const serviceUUIDs = deviceType.data.map((item: { serviceUUID: any; }) => item.serviceUUID);
        try{
            //设置寻找蓝牙设备的类型和请求的服务的UUID
            //这里需要对不同的蓝牙设备进行处理，目前只有心率
            const device = await navigator.bluetooth.requestDevice({ 
                acceptAllDevices: true,
                optionalServices: serviceUUIDs
            })
            console.log(`Selected Device Name: ${device.name}`)
            console.log(`Selected Device ID: ${device.id}`)
            return device
        } catch (error) {
            console.error('Fail to connector BLE device:', error)
        }
    }

    async EstablishBLEConnection(deviceType:any){
        if(this.CheckBLEAvailable()){
            const device = await this.RequestBLEConnection(deviceType)
            const server = await this.GetBLEConnection(device)
            return server
        }
    }

    async GetCharacteristicsAndParse(server:any, deviceType:any){
        //将uuid提取出来
        const serviceUUIDs = deviceType.data.map((item: { serviceUUID: any; }) => item.serviceUUID);
        const characteristicUUIDs = deviceType.data.map((item: { characteristicUUID: any; }) => item.characteristicUUID);
    
        const characteristics = new Array<any>(characteristicUUIDs.length).fill(0)
        //只是初版，现在只写了获得心率带服务信息的代码，后续最好用可以扩展的数据结构来处理
        try{
            //对所有所需数据设置通知
            for(let i = 0; i<characteristicUUIDs.length; i++){
                const service = await server.getPrimaryService(serviceUUIDs[i])
                characteristics[i] = await service.getCharacteristic(characteristicUUIDs[i])
                
                //如果该数据项可以读取，则读取一次作为初始值
                if(characteristics[i].properties.read){
                    const initData = await characteristics[i].readValue();
                    this.parsedData[i] = deviceType.data[i].parser.parseData(initData)
                    this.notifyListeners()
                } 

                characteristics[i].addEventListener('characteristicvaluechanged', (event:any) => {
                    const value = event.target.value;
                    if (value) {
                        const data = deviceType.data[i].parser.parseData(value);
                        this.parsedData[i] = data
                        // console.log(`${deviceType.data[i].name}: ${data} BPM`);
                        // console.log(this.parsedData[0])
                        this.notifyListeners()
                    }
                });
                await characteristics[i].startNotifications();
                console.log(`${deviceType.data[i].name} notifications started.`);
            }
    
        }catch(error){
            console.log(error)
        }
    }
}