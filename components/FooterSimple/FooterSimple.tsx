import {Anchor, Container, Group} from '@mantine/core';
import classes from './FooterSimple.module.css';

const links = [
    {link: '#', label: 'Address: Beijing University of Technology, Pingleyuan 1, Chaoyang District, Beijing'},
    {link: '#', label: 'Email: linyu.zhang@ucdconnect.ie'},
];

export function FooterSimple() {
    const items = links.map((link) => (
        <Anchor<'a'>
            c="dimmed"
            key={link.label}
            href={link.link}
            onClick={(event) => event.preventDefault()}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <Group className={classes.links}>{items}</Group>
            </Container>
        </div>
    );
}
