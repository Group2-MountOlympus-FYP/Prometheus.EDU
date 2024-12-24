import pool from "@/lib/db";

export default async function Cart() {
    const {rows} = await pool.query(`SELECT * from CARTS`);

    return (
        <div>
            test
            {rows.map((row) => (
                <div key={row.id}>
                    {row.id} - {row.quantity}
                </div>
            ))}
        </div>
    );
}
