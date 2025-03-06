'use client'
import { Card, Image, Text } from "@mantine/core"
import { IoCaretForwardCircle } from "react-icons/io5";
import { useEffect, useState } from "react";

export type CourseCardInfo = {
    playCount?: number,
    url?: string,
    name?: string
}

export function CourseCard({ playCount = 0, url = 'courseSample.jpg', name = 'Course Name' }: CourseCardInfo) {
    return (
        <div>
            <Card shadow="sm" style={{width:"200px"}}>
                <Card.Section>
                    <div style={{maxHeight:"160px", maxWidth:"200px"}}>
                        <Image src={`/${url}`} alt="course picture"></Image>
                    </div>
                </Card.Section>
                <Card.Section style={{marginBottom:'3px', paddingLeft: '5px'}}>
                    <Text>{name}</Text>
                </Card.Section>
                <Card.Section>
                    <div style={{display:'flex' , paddingLeft: '5px'}}>
                        <IoCaretForwardCircle />
                        <Text size="xs">{playCount}</Text>
                    </div>
                </Card.Section>
            </Card>
        </div>
    );
}


