export interface DataParser {
    parseData(value: DataView):any
}

//心率数据处理
export class HeartRateDataParser implements DataParser {
    parseData(value: DataView) {
        if (value.byteLength === 0) {
            console.error("DataView is empty");
            return null;
        }
    
        // 验证第一个偏移量是否有效
        if (value.byteLength < 1) {
            console.error("Invalid DataView: insufficient length for flags");
            return null;
        }
    
        const flags = value.getUint8(0); // 获取标志位
        const is16Bit = flags & 0x01;   // 检查是否为 16 位格式
    
        // 如果是 16 位格式，验证缓冲区是否足够长
        if (is16Bit) {
            if (value.byteLength < 3) { // 1 字节标志位 + 2 字节心率值
                console.error("Invalid DataView: insufficient length for 16-bit heart rate");
                return null;
            }
            return value.getUint16(1, true); // 使用小端字节序解析 16 位心率值
        } else {
            // 验证缓冲区是否足够长以获取 8 位心率值
            if (value.byteLength < 2) { // 1 字节标志位 + 1 字节心率值
                console.error("Invalid DataView: insufficient length for 8-bit heart rate");
                return null;
            }
            return value.getUint8(1); // 解析 8 位心率值
        }
    }

}

//电池数据处理
export class BatteryLevelParser implements DataParser{
    parseData(value: DataView) {
        return value.getUint8(0)
    }
}