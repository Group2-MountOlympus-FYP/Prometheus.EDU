// app/api/submissions/export/route.js
import {NextResponse} from 'next/server';
import pool from '@/lib/db';
import ExcelJS from 'exceljs';

export async function GET() {
    try {
        const {rows} = await pool.query('SELECT * FROM submissions ORDER BY created_at DESC');

        // 创建一个新的工作簿
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Submissions');

        // 添加表头
        worksheet.columns = [
            {header: 'ID', key: 'id', width: 10},
            {header: '公司名称', key: 'company_name', width: 30},
            {header: '联系方式', key: 'contact_info', width: 30},
            {header: '交易种类', key: 'transaction_type', width: 15},
            {header: '交易数量（吨）', key: 'transaction_quantity', width: 15},
            {header: '预期交易价格', key: 'expected_price', width: 15},
            {header: '交易时间', key: 'transaction_date', width: 15},
            {header: '备注', key: 'notes', width: 40},
            {header: '创建时间', key: 'created_at', width: 20},
        ];

        // 添加数据行
        rows.forEach((row) => {
            worksheet.addRow(row);
        });

        // 将工作簿写入 Buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // 设置响应头，返回 Excel 文件
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="submissions.xlsx"',
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    } catch (error) {
        console.error('Error exporting submissions:', error);
        return NextResponse.json(
            {error: 'Error exporting submissions'},
            {status: 500}
        );
    }
}