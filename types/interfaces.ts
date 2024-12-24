export interface Item {
    id: number;
    description: string;
    name: string;
    chinesename: string
}

interface Link {
    link: string; // The URL or path of the link
    label: string; // The display label for the link
    links?: Link[]; // Optional nested links for dropdowns or submenus
}

export interface HeaderMenuProps {
    links: Link[];
}
