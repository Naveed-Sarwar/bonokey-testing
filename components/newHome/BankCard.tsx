import { AprValue } from "@prisma/client";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React from "react";
import toast from "react-hot-toast";
import { FaChevronDown, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { saveContactInfoToDB } from "../../controller/Contact";
import { firebaseAuth } from "../../utils/firebase";
import { brandColors, uiBreakpoint } from "../../utils/helpers";

export type BankType = {
    id: number;
    name: string;
    logo: string;
    mobile: string;
    salaryTransfer: boolean;
    minSalary: number;
    minLoan: number;
    offer: boolean;
    aprValues: AprValue[];
};

export type BankProps = {
    name: string;
    logo: string;
    mobile: string;
    apr: number;
    loan: number;
    monthly: number;
    total: number;
    fees: number;
    maxLoan: number;
    salaryTransfer: boolean;
    revenue: number;
    minLoan: number;
    offer: boolean;
    useMaxLoan: boolean;

    loanDurationInYears: number;
    sector: string;
    userMonthlySalary: number;
};

type Props = {
    index: number;
    bank: BankProps;
    phoneNumberVerified: boolean;
    setPhoneNumberVerified: React.Dispatch<React.SetStateAction<boolean>>;
};

const CardDiv = styled.div`
    transition: transform 0.15s;
    &:hover {
        transform: scale(1.01);
    }
`;

const MainContentDiv = styled.div`
    background-color: ${brandColors.white};
    border-radius: 10px 10px 0px 0px;
    padding: 32px;
`;

const BankName = styled.h4`
    font-size: 1rem;
    font-weight: 700;
    color: ${brandColors.black};

    text-align: left;

    /* PHONE UI */
    @media only screen and (max-width: 950px) {
        text-align: center;
    }
`;

const MainGridDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 24px;

    /* PHONE UI */
    @media only screen and (max-width: 950px) {
        grid-template-columns: 1fr;
    }
`;

const KPIDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;

    /* PHONE UI */
    @media only screen and (max-width: 950px) {
        justify-content: center;
    }
`;

const ContactDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
    justify-content: right;

    /* PHONE UI */
    @media only screen and (max-width: 950px) {
        justify-content: center;
    }
`;

const KPIValue = styled.p`
    font-size: 1rem;
    font-weight: 600;
    color: ${brandColors.captionBlack};
`;

const KPIName = styled.p`
    font-size: 1rem;
    font-weight: 300;
    color: ${brandColors.captionBlack};
`;

const DetailDiv = styled.div`
    cursor: pointer;

    background-color: ${brandColors.captionBlack}25;
    border-radius: 0 0 10px 10px;
    padding: 12px;
`;

const DetailText = styled.p`
    font-size: 0.85rem;
    font-weight: 300;
    color: ${brandColors.captionBlack};
`;

const PercentageText = styled.h5`
    font-size: 1rem;
    font-weight: 700;
    color: ${brandColors.red};
`;

const ContactButton = styled.button`
    all: unset;
    cursor: pointer;
    color: ${brandColors.black};

    outline: 3px solid ${brandColors.purple};
    border-radius: 5px;

    padding: 10px;
    text-align: center;

    &:hover:enabled {
        outline: none;
        color: ${brandColors.white};
        background: linear-gradient(90deg, ${brandColors.purple} 0%, ${brandColors.lighterPurple} 100%);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.75;
    }
`;

const DetailLi = styled.li`
    font-size: 0.85rem;
    font-weight: 300;
    color: ${brandColors.captionBlack};
`;

const DetailGridDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 0 12px 12px 12px;

    /* PHONE UI */
    @media only screen and (max-width: ${uiBreakpoint}px) {
        grid-template-columns: 1fr;
    }
`;

const DetailMoneyGridDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    /* PHONE UI */
    @media only screen and (max-width: ${uiBreakpoint}px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const PromptDiv = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const PromptContentDiv = styled.div`
    background-color: ${brandColors.white};
    border-radius: 10px;
    padding: 48px;

    text-align: center;
    max-width: 600px;
    margin: 0 12px;
    box-shadow: 0px 0px 12px 5px ${brandColors.black}12;
`;

const PromptButton = styled.button`
    all: unset;
    cursor: pointer;
    color: ${brandColors.white};
    //     background-color: ${brandColors.purple};
    background: linear-gradient(90deg, ${brandColors.purple} 0%, ${brandColors.lighterPurple} 100%);

    padding: 10px;
    border-radius: 5px;
    text-align: center;

    &:hover:enabled {
        background: none;
        color: ${brandColors.black};
        outline: 3px solid ${brandColors.purple};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.75;
    }
`;

const PromptText = styled.p`
    font-size: 1rem;
    font-weight: 500;
    color: ${brandColors.black};
`;

const PromptInput = styled.input`
    all: unset;

    font-size: 1rem;
    font-weight: 500;
    color: ${brandColors.black};

    border: none;
    padding-bottom: 6px;
    border-bottom: 2px solid ${brandColors.black}25;

    &:focus {
        border-bottom: 2px solid ${brandColors.black};
    }
`;

const BankNameDiv = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: left;

    /* PHONE UI */
    @media only screen and (max-width: ${uiBreakpoint}px) {
        justify-content: center;
    }
`;

function BankCard(props: Props) {
    const [showDetail, setShowDetail] = React.useState(false);
    const [showContactPrompt, setShowContactPrompt] = React.useState(false);

    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [phoneNumberConfirmationResult, setPhoneNumberConfirmationResult] = React.useState<ConfirmationResult>(null);
    const [phoneNumberVerificationCode, setPhoneNumberVerificationCode] = React.useState("");

    return (
        <div>
            <CardDiv data-aos="fade-up" data-aos-delay={`${props.index}0`}>
                <MainContentDiv>
                    <MainGridDiv style={{ alignItems: "center" }}>
                        <BankNameDiv>
                            <img style={{ width: "80px" }} src={props.bank.logo} />
                            <BankName>{props.bank.name}</BankName>
                        </BankNameDiv>
                        <KPIDiv>
                            <div style={{ textAlign: "center" }}>
                                <KPIValue>{props.bank.loan.toLocaleString(undefined)} SAR</KPIValue>
                                <KPIName>Loan amount</KPIName>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <KPIValue>{props.bank.monthly.toLocaleString(undefined)} SAR</KPIValue>
                                <KPIName>Monthly</KPIName>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <KPIValue>{props.bank.total.toLocaleString(undefined)} SAR</KPIValue>
                                <KPIName>Total</KPIName>
                            </div>
                        </KPIDiv>
                        <ContactDiv>
                            <PercentageText>{props.bank.apr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</PercentageText>
                            <ContactButton disabled={false} onClick={() => setShowContactPrompt(true)}>
                                Contact
                            </ContactButton>
                        </ContactDiv>
                    </MainGridDiv>
                </MainContentDiv>
                <DetailDiv onClick={() => setShowDetail(!showDetail)}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}>
                        <div></div>
                        <div>
                            <DetailText style={{ textAlign: "center" }}>
                                The APR may vary depending on the loan amount, salary, employer, and term. It may be affected by each clients credit scroing.
                            </DetailText>
                        </div>
                        <div style={{ textAlign: "right", marginRight: "24px" }}>
                            <FaChevronDown color={brandColors.captionBlack} />
                        </div>
                    </div>

                    {showDetail && (
                        <DetailGridDiv style={{ marginTop: "24px", paddingLeft: "24px", paddingRight: "24px" }}>
                            <div style={{ textAlign: "left" }}>
                                <DetailText style={{ fontWeight: "700" }}>Features</DetailText>
                                <ul style={{ listStyle: "inside", marginTop: "12px" }}>
                                    <DetailLi style={{ marginBottom: "6px" }}>Shariah compliant.</DetailLi>
                                    <DetailLi style={{ marginBottom: "6px" }}>Instant approval.</DetailLi>
                                    <DetailLi style={{ marginBottom: "6px" }}>Repayment periods from 3 months up to 12 months.</DetailLi>
                                    <DetailLi style={{ marginBottom: "6px" }}>Possibility of early settlement.</DetailLi>
                                    <DetailLi>Possibility of postponing the installment of the month of Ramadan.</DetailLi>
                                </ul>
                            </div>
                            <DetailMoneyGridDiv>
                                <div style={{ textAlign: "center" }}>
                                    <FaMoneyBillWave color={brandColors.moneyGreen} size={25} />
                                    <DetailText style={{ fontWeight: "500", marginBottom: "3px" }}>Admin Fees + Tax</DetailText>
                                    <DetailText>{props.bank.fees.toLocaleString(undefined)} SAR</DetailText>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <FaMoneyBillWave color={brandColors.moneyGreen} size={25} />
                                    <DetailText style={{ fontWeight: "500", marginBottom: "3px" }}>Max loan</DetailText>
                                    <DetailText>{props.bank.maxLoan.toLocaleString(undefined)} SAR</DetailText>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <FaMoneyBillWave color={brandColors.moneyGreen} size={25} />
                                    <DetailText style={{ fontWeight: "500", marginBottom: "3px" }}>Salary transfer</DetailText>
                                    <DetailText>{props.bank.salaryTransfer ? "YES" : "NO"}</DetailText>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <FaMoneyBillWave color={brandColors.moneyGreen} size={25} />
                                    <DetailText style={{ fontWeight: "500", marginBottom: "3px" }}>Bank&apos;s Profit</DetailText>
                                    <DetailText>{props.bank.revenue.toLocaleString(undefined)} SAR</DetailText>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <FaMoneyBillWave color={brandColors.moneyGreen} size={25} />
                                    <DetailText style={{ fontWeight: "500", marginBottom: "3px" }}>Min loan</DetailText>
                                    <DetailText>{props.bank.minLoan.toLocaleString(undefined)} SAR</DetailText>
                                </div>
                            </DetailMoneyGridDiv>
                        </DetailGridDiv>
                    )}
                </DetailDiv>
            </CardDiv>

            {/* Contact Prompt */}
            {showContactPrompt && (
                <PromptDiv onClick={() => setShowContactPrompt(!showContactPrompt)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        {!props.phoneNumberVerified ? (
                            <PromptContentDiv>
                                <div style={{ textAlign: "right", marginBottom: "24px" }}>
                                    <FaTimes color={brandColors.black} size={25} style={{ cursor: "pointer" }} onClick={() => setShowContactPrompt(!showContactPrompt)} />
                                </div>
                                <PromptText>In order to contact a bank representative you will have to verify your number via sms first.</PromptText>
                                <div style={{ marginTop: "24px" }}>
                                    {!phoneNumberConfirmationResult ? (
                                        <div>
                                            <div>
                                                <PromptInput
                                                    id="userMobile"
                                                    type="tel"
                                                    value={phoneNumber}
                                                    placeholder="+966569599298"
                                                    onChange={(e) => {
                                                        const regex = /^[0-9+]+$/;
                                                        const parsedMobile = e.target.value;

                                                        if (parsedMobile === "" || regex.test(parsedMobile)) {
                                                            setPhoneNumber(parsedMobile);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div id="recaptcha-container"></div>
                                            <PromptButton
                                                style={{ marginTop: "24px" }}
                                                disabled={!(phoneNumber.length > 0)}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    try {
                                                        toast.loading("");
                                                        console.log("clicked");

                                                        const captcha = new RecaptchaVerifier(
                                                            "recaptcha-container",
                                                            {
                                                                size: "invisible",
                                                                callback: () => {
                                                                    // This will be called when the reCAPTCHA widget is completed
                                                                },
                                                            },
                                                            firebaseAuth
                                                        );

                                                        return signInWithPhoneNumber(firebaseAuth, phoneNumber, captcha)
                                                            .then(async (confirmationResult) => {
                                                                console.log("Code sent");
                                                                toast.dismiss();
                                                                toast.success("Code sent.");

                                                                captcha.clear();
                                                                return setPhoneNumberConfirmationResult(confirmationResult);
                                                            })
                                                            .catch((error) => {
                                                                console.log("Something went wrong signing in with phone number: " + error);
                                                                toast.dismiss();
                                                                toast.error("Something went wrong. Try again later.");
                                                            });
                                                    } catch (error) {
                                                        console.log("Something went wrong with phone sign in or recaptcha: " + error);
                                                    }
                                                }}
                                            >
                                                Send verification code
                                            </PromptButton>
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: "24px" }}>
                                            <div>
                                                {/* <label htmlFor="userMobile">Verification code</label> */}
                                                <PromptInput
                                                    id="userVerificationCode"
                                                    type="text"
                                                    value={phoneNumberVerificationCode}
                                                    maxLength={6}
                                                    placeholder="123456"
                                                    onChange={(e) => {
                                                        setPhoneNumberVerificationCode(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <PromptButton
                                                disabled={!(phoneNumberVerificationCode.length >= 6)}
                                                style={{ marginTop: "12px" }}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    toast.loading("");
                                                    return phoneNumberConfirmationResult
                                                        .confirm(phoneNumberVerificationCode)
                                                        .then((userCred) => {
                                                            toast.dismiss();
                                                            if (userCred.user) {
                                                                // Number verified
                                                                console.log("number verified successfully");
                                                                toast.success("Number verified successfully.");
                                                                props.setPhoneNumberVerified(true);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            // Wrong verification code?
                                                            console.log("Something went wrong signing in with phone number: " + "This might be the wrong verification code");
                                                            toast.dismiss();
                                                            toast.error("Incorrect verification code.");
                                                        });
                                                }}
                                            >
                                                Verifiy code
                                            </PromptButton>
                                        </div>
                                    )}
                                </div>
                            </PromptContentDiv>
                        ) : (
                            <PromptContentDiv>
                                <div style={{ textAlign: "right", marginBottom: "24px" }}>
                                    <FaTimes color={brandColors.black} size={25} style={{ cursor: "pointer" }} onClick={() => setShowContactPrompt(!showContactPrompt)} />
                                </div>
                                <PromptText>
                                    Your number is now verified!
                                    <br />
                                    Press the button below to contact a bank representative
                                </PromptText>
                                <PromptButton
                                    disabled={!props.phoneNumberVerified}
                                    style={{ marginTop: "12px" }}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        toast.loading("");

                                        // Save data to firestore
                                        await saveContactInfoToDB(
                                            props.bank.loan,
                                            props.bank.userMonthlySalary,
                                            props.bank.sector,
                                            props.bank.loanDurationInYears,
                                            props.bank.apr,
                                            props.bank.name,
                                            props.bank.mobile,
                                            phoneNumber
                                        );

                                        toast.dismiss();
                                        // Redirect to whatsapp with predefined message
                                        const whatsappMessage = `Hi there,\nI wanted to reach out and apply for a loan at ${props.bank.name}.\nThese are my application details:\n\n- Sector: ${props.bank.sector}\n- Loan amount: ${props.bank.loan}\n- Loan duration (in years): ${props.bank.loanDurationInYears}\n- APR: ${props.bank.apr}\n- Monthly Salary: ${props.bank.userMonthlySalary}\n\nI am looking forward to hearing from you.\nKind regards.`;
                                        const encodedMessage = encodeURIComponent(whatsappMessage).replace(/\n/g, "%0a");

                                        return window.open(`https://wa.me/${props.bank.mobile}?text=${encodedMessage}`);
                                    }}
                                >
                                    Contact now
                                </PromptButton>
                            </PromptContentDiv>
                        )}
                    </div>
                </PromptDiv>
            )}
        </div>
    );
}

export default BankCard;
