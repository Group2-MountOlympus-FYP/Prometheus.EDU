'use client'
import { getText } from "./language"
import './UserAgreement.css'

type UserAgreementProps = {
    onAgreeClick?():void
}

export function UserAgreement({ onAgreeClick = () => {}} : UserAgreementProps){
    return (
        <div className="container">
            <h1>{getText("introduction")}</h1>

            <h2>{getText("definitions")}</h2>
            <p>1. {getText("we")}</p>
            <p>2. {getText("user")}</p>
            <p>3. {getText("services")}</p>

            <h2>{getText("registration")}</h2>
            <ul>
                <li>{getText("guarantee_info")}</li>
                <li>{getText("account_usage")}</li>
                <li>{getText("legal_usage")}</li>
            </ul>

            <h2>{getText("privacy_policy")}</h2>
            <h3>1. {getText("info_collection")}</h3>
            <ul>
                <li>{getText("reg_info")}</li>
                <li>{getText("usage_records")}</li>
            </ul>

            <h3>2. {getText("info_usage")}</h3>
            <ul>
                <li>{getText("provide_service")}</li>
                <li>{getText("personalize_content")}</li>
                <li>{getText("comply_laws")}</li>
            </ul>

            <h3>3. {getText("info_sharing")}</h3>

            <h3>4. {getText("info_security")}</h3>

            <h2>{getText("user_rights")}</h2>
            <ul>
                <li>{getText("access_info")}</li>
                <li>{getText("withdraw_consent")}</li>
            </ul>

            <h2>{getText("service_changes")}</h2>
            <ul>
                <li>{getText("adjust_service")}</li>
                <li>{getText("suspend_service")}</li>
            </ul>

            <h2>{getText("disclaimer")}</h2>
            <ul>
                <li>{getText("user_responsibility")}</li>
                <li>{getText("force_majeure")}</li>
            </ul>

            <h2>{getText("intellectual_property")}</h2>
            <ul>
                <li>{getText("all_content_rights")}</li>
                <li>{getText("unauthorized_use")}</li>
            </ul>

            <h2>{getText("agreement_modification")}</h2>

            <h2>{getText("governing_law")}</h2>
            <ul>
                <li>{getText("dispute_resolution")}</li>
            </ul>

            <h2>{getText("contact")}</h2>
            <p>3296446003@qq.com</p>

            <p>{getText("effective_date")} 2025-03-01</p>

            <button onClick={onAgreeClick}>{getText("submit")}</button>
        </div>

    )
}