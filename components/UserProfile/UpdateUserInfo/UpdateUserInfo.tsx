'use client'

import { useState, useEffect, useContext } from "react"
import { Button, Input, Select } from "@mantine/core"
import { DateInput, DatePicker } from '@mantine/dates';
import './UpdateUserInfo.css'
import { getText } from "../Language";
import '@mantine/dates/styles.css';
import { CheckUsernameExist } from "@/app/api/Register/router";
import dayjs from 'dayjs';
import { updateProfile } from "@/app/api/User/router";
import { notifications } from "@mantine/notifications";
import { reloadWindow } from "@/app/api/General";
import { LoadingContext } from "@/components/Contexts/LoadingContext";


export function UpdateUserInfoPanel({currentUsername}: {currentUsername: string}){
    const { isLoading, setIsLoading } = useContext(LoadingContext)

    const [username, setUsername] = useState<string>(currentUsername)
    const [birthDate, setBirthDate] = useState<Date | null>()
    const [gender, setGender] = useState<string>("male")
    const [usernameError, setUSernameError] = useState('')
    const [isAbleSubmit, setIsAbleSubmit] = useState<boolean>(true)

    const checkUsernameExist = async () => {
        if(!username){
            return
        }
        if(username != currentUsername){
            CheckUsernameExist(username)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data)
                if(data.Occupied == false){
                    setUSernameError('')
                    setIsAbleSubmit(true)
                }else{
                    setUSernameError(getText("UsernameExist"))
                    setIsAbleSubmit(false)
                }
            })
            .catch((error) => {
                console.error("Error: " , error)
            })
        }else{
            setIsAbleSubmit(true)
        }
    }
    
    const handleSubmit = async (e:any) => {
        e.preventDefault()
        //console.log(data)
        try{
            setIsLoading(true)
            const response = await updateProfile(username, dayjs(birthDate).format('YYYY-MM-DD'), gender)
            notifications.show({
                title: "Update success",
                message: "Update success"
            })
            setTimeout(() => {
                reloadWindow()
            }, 500);
        }catch(e){
            console.log(e)
            setIsLoading(false)
        }
        
    }
    return (
        <div className="bg">
            <form onSubmit={handleSubmit} className="infoForm">
                <Input.Wrapper label={getText("username")} error={usernameError} withAsterisk>
                    <Input placeholder={getText("username")} onBlur={checkUsernameExist} value={username} onChange={(event) => setUsername(event.target.value)}></Input>
                </Input.Wrapper>
                <DateInput label={getText("birthdate")} value={birthDate} disabled withAsterisk></DateInput>
                <DatePicker value={birthDate} onChange={setBirthDate}></DatePicker>
                <GenderSelect value={gender} onChange={setGender} withAsterisk></GenderSelect>
                <Button type="submit" disabled={!isAbleSubmit} className="submitButton">{getText("submit")}</Button>
            </form>
        </div>
    )
}

function GenderSelect({ value, onChange }:any) {
    const [genderOptions, setGenderOptions] = useState([{value: "male", label: "male"}])

    useEffect(() => {
        const genderOptionsData = [
            { value: 'male', label: getText("male") },    // 中文展示，实际值是'male'
            { value: 'female', label: getText("female") },
            { value: 'other', label: getText("other") },
        ];
        setGenderOptions(genderOptionsData)
    }, [])

    return (
        <Select
        label= {getText("gender")}
        placeholder={getText("PleaseSelectGender")}
        data={genderOptions}
        value={value}
        onChange={onChange} // 返回的是 value，例如 "male"
        />
    );
}
