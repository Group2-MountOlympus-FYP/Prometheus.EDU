import { DataParser, HeartRateDataParser, BatteryLevelParser } from "./BLEDataParser"

//定义蓝牙访问类型的数据结构
type ServiceType = {
    name: string;
    serviceUUID: string;
    characteristicUUID: string;
    parser: DataParser;
};

export const EmptyDevice: {data: ServiceType[] } = {
    data: []
}

//对应每种特定的蓝牙设备数据
export const HeartRateStrapData: { data: ServiceType[] } = {
    data: [
        {
            name: 'heart_rate',
            serviceUUID: 'heart_rate',
            characteristicUUID: 'heart_rate_measurement',
            parser: new HeartRateDataParser()
        },
        {
            name: 'battery',
            serviceUUID: 'battery_service',
            characteristicUUID: 'battery_level',
            parser: new BatteryLevelParser()
        }
    ]
}