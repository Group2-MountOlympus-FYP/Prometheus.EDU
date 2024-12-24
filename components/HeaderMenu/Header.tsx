import pool from "@/lib/db";
import {HeaderMenu} from "./HeaderMenu";

export default async function Header() {
    // const {rows} = await pool.query(`SELECT * FROM tags`);
    const links = [
        {link: '/', label: '首页'},
        // {
        //     link: '/tags',
        //     label: '学习碳市场',
        //     links: rows.map((tag) => ({
        //         link: `/tags/${tag.address}`,
        //         label: tag.tag_content,
        //     })),
        // },
        {link: '/about-us', label: '关于我们'},
    ];

    return (<HeaderMenu links={links}/>);

}