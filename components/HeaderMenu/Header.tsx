import pool from "@/lib/db";
import {HeaderMenu} from "./HeaderMenu";

export default async function Header() {
    const links = [
        // {link: '/', label: '首页'},
        {link: '/about-us', label: '关于我们'},
    ];

    return (<HeaderMenu links={links}/>);

}