import React from "react";
import Image from "next/image";
import styles from "../styles/Bank.module.scss";
import * as PrismaTypes from "@prisma/client";

import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
import { toast } from "react-hot-toast";
import { saveContactInfoToDB } from "../controller/Contact";

export type BankType = {
    id: number;
    name: string;
    logo: string;
    mobile: string;
    salaryTransfer: boolean;
    minSalary: number;
    minLoan: number;
    offer: boolean;
    aprValues: PrismaTypes.AprValue[];
};

export type Props = {
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

type State = {
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
    showDetails: boolean;

    loanDurationInYears: number;
    sector: string;
    userMonthlySalary: number;

    showContactPrompt: boolean;
    userMobile: string;
    recaptchaVerifier: RecaptchaVerifier;
    userMobileVerificationCode: string;
    userConfirmationResult: ConfirmationResult;
    userMobileVerified: boolean;
};

class Bank extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name || "",
            logo: props.logo || "",
            mobile: props.mobile || "",
            apr: props.apr || 0,
            loan: props.loan || 0,
            monthly: props.monthly || 0,
            total: props.total || 0,
            fees: props.fees || 0,
            maxLoan: props.maxLoan || 0,
            salaryTransfer: props.salaryTransfer || false,
            revenue: props.revenue || 0,
            minLoan: props.minLoan || 0,
            offer: props.offer || false,
            showDetails: false,

            loanDurationInYears: props.loanDurationInYears || 0,
            sector: props.sector || "",
            userMonthlySalary: props.userMonthlySalary || 0,

            showContactPrompt: false,
            userMobile: "",
            recaptchaVerifier: null,
            userMobileVerificationCode: "",
            userConfirmationResult: null,
            userMobileVerified: false,
        };
    }

    formatNumber(value: string) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    render() {
        return (
            <div className={styles.bank}>
                <h6 className={styles.name}>{this.state.name}</h6>

                <div className={styles.info}>
                    <div className={styles.logo}>
                        <Image src={this.state.logo} alt="" width={146} height={60} layout={"responsive"} />
                    </div>

                    <div className={styles.apr}>
                        <h6>
                            {this.state.apr.toFixed(2)}%<span>fixed</span>
                        </h6>
                        <p>Annual percentage rate (APR)</p>
                    </div>

                    <div className={styles.text}>
                        <h6>
                            {this.formatNumber(this.state.loan.toFixed(0))} <span style={{ fontSize: 13 }}>SAR</span>
                        </h6>
                        <p>{this.props.useMaxLoan ? "Max Loan" : "Loan Amount"}</p>
                    </div>

                    <div className={styles.text}>
                        <h6>
                            {this.formatNumber(this.state.monthly.toFixed(0))} <span style={{ fontSize: 13 }}>SAR</span>
                        </h6>
                        <p>Monthly Installment</p>
                    </div>

                    <div className={styles.text}>
                        <h6>
                            {this.formatNumber(this.state.total.toFixed(0))} <span style={{ fontSize: 13 }}>SAR</span>
                        </h6>
                        <p>Total Amount</p>
                    </div>

                    <div className={`${styles.text} ${styles.mobileShow}`}>
                        <h6>
                            {this.state.fees.toFixed(0)} <span style={{ fontSize: 13 }}>SAR</span>
                        </h6>
                        <p>Admin Fees</p>
                    </div>

                    <button className={`${styles.contact} ${styles.mobileHide}`} onClick={() => this.setState({ showContactPrompt: !this.state.showContactPrompt })}>
                        Contact <br /> Bank Representative
                    </button>

                    <button className={`${styles.contact} ${styles.mobileShow}`} onClick={() => this.setState({ showContactPrompt: !this.state.showContactPrompt })}>
                        Contact Bank Representative
                    </button>
                </div>

                <div className={styles.details}>
                    {!this.state.showDetails ? (
                        <p className={styles.text}>The APR may vary depending on the loan amount, salary, employer, and term. It may be affected by each client’s credit scoring.</p>
                    ) : (
                        <div className={styles.content}>
                            <div className={styles.features}>
                                <h6>Features</h6>
                                <ul className={styles.list}>
                                    <li>Shariah compliant.</li>
                                    <li>Instant approval.</li>
                                    <li>Repayment periods from 3 months up to 12 months.</li>
                                    <li>Possibility of early settlement.</li>
                                    <li>Possibility of postponing the installment of the month of Ramadan.</li>
                                </ul>
                            </div>

                            <div className={`${styles.detail} ${styles.mobileHide}`}>
                                <i className={styles.icon}>
                                    <svg viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                                            fill="#EAEAEA"
                                        />
                                        <path d="M4.62769 3.65161V4.80934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.62769 8.28162V9.43934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 6.54541H3.05117" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.20367 6.54541H7.25484" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
                                            fill="#4C241D"
                                        />
                                        <path
                                            d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="5.08 5.08"
                                        />
                                        <path
                                            d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M15.7704 28.6364H18.7419" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </i>
                                <h6>Admin Fees + Tax</h6>
                                <p>{this.state.fees.toFixed(0)}</p>
                            </div>

                            <div className={styles.detail}>
                                <i className={styles.icon}>
                                    <svg viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                                            fill="#EAEAEA"
                                        />
                                        <path d="M4.62769 3.65161V4.80934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.62769 8.28162V9.43934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 6.54541H3.05117" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.20367 6.54541H7.25484" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
                                            fill="#4C241D"
                                        />
                                        <path
                                            d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="5.08 5.08"
                                        />
                                        <path
                                            d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M15.7704 28.6364H18.7419" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </i>
                                <h6>Max Loan</h6>
                                <p>{this.state.maxLoan.toFixed(0)}</p>
                            </div>

                            <div className={styles.detail}>
                                <i className={styles.icon}>
                                    <svg viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                                            fill="#EAEAEA"
                                        />
                                        <path d="M4.62769 3.65161V4.80934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.62769 8.28162V9.43934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 6.54541H3.05117" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.20367 6.54541H7.25484" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
                                            fill="#4C241D"
                                        />
                                        <path
                                            d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="5.08 5.08"
                                        />
                                        <path
                                            d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M15.7704 28.6364H18.7419" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </i>
                                <h6>Salary Transfer</h6>
                                <p>{this.state.salaryTransfer ? "Yes" : "No"}</p>
                            </div>

                            <div className={styles.detail}>
                                <i className={styles.icon}>
                                    <svg viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                                            fill="#EAEAEA"
                                        />
                                        <path d="M4.62769 3.65161V4.80934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.62769 8.28162V9.43934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 6.54541H3.05117" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.20367 6.54541H7.25484" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
                                            fill="#4C241D"
                                        />
                                        <path
                                            d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="5.08 5.08"
                                        />
                                        <path
                                            d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M15.7704 28.6364H18.7419" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </i>
                                <h6>Bank&apos;s Profit</h6>
                                <p>{this.state.revenue.toFixed(0)}</p>
                            </div>

                            <div className={styles.detail}>
                                <i className={styles.icon}>
                                    <svg viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                                            fill="#EAEAEA"
                                        />
                                        <path d="M4.62769 3.65161V4.80934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.62769 8.28162V9.43934" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 6.54541H3.05117" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.20367 6.54541H7.25484" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
                                            fill="#4C241D"
                                        />
                                        <path
                                            d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
                                            fill="#FFCE56"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="5.08 5.08"
                                        />
                                        <path
                                            d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
                                            stroke="#4C241D"
                                            strokeWidth="2.54276"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M15.7704 28.6364H18.7419" stroke="#4C241D" strokeWidth="2.54276" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </i>
                                <h6>Min Loan</h6>
                                <p>{this.state.minLoan.toFixed(0)}</p>
                            </div>
                        </div>
                    )}

                    <button style={this.state.showDetails ? { marginLeft: 25 } : { marginLeft: 10 }} onClick={() => this.setState({ showDetails: !this.state.showDetails })}>
                        {this.state.showDetails ? "Hide" : "Details"}
                        <i className={styles.icon}>
                            {!this.state.showDetails ? (
                                <svg style={{ marginBottom: 2 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            ) : (
                                <svg style={{ marginTop: 2 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
                                </svg>
                            )}
                        </i>
                    </button>
                </div>

                {/* Mobile Verification Form */}
                {this.state.showContactPrompt && (
                    <div className={styles.phoneContact} onClick={() => this.setState({ showContactPrompt: !this.state.showContactPrompt })}>
                        <div className={styles.contentDiv} onClick={(e) => e.stopPropagation()}>
                            {!this.state.userMobileVerified ? (
                                <div>
                                    <p>In order to contact a bank representative you will have to verify your number via sms first.</p>
                                    <div style={{ marginTop: "36px" }}>
                                        {!this.state.userConfirmationResult ? (
                                            <div>
                                                <div className={styles.inputContainer}>
                                                    <label htmlFor="userMobile">Phone Number</label>
                                                    <input
                                                        id="userMobile"
                                                        type="tel"
                                                        value={this.state.userMobile}
                                                        placeholder="+966569599298"
                                                        onChange={(e) => {
                                                            const parsedMobile = e.target.value;
                                                            this.setState({ userMobile: parsedMobile });
                                                        }}
                                                    />
                                                </div>

                                                <div id="recaptcha-container"></div>
                                                <button
                                                    className={styles.verifyButton}
                                                    style={{ marginTop: "12px" }}
                                                    disabled={!(this.state.userMobile.length > 0)}
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

                                                            return signInWithPhoneNumber(firebaseAuth, this.state.userMobile, captcha)
                                                                .then(async (confirmationResult) => {
                                                                    console.log("Code sent");
                                                                    toast.dismiss();
                                                                    toast.success("Code sent.");

                                                                    captcha.clear();
                                                                    return this.setState({ userConfirmationResult: confirmationResult });
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
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: "24px" }}>
                                                <div className={styles.inputContainer}>
                                                    <label htmlFor="userMobile">Verification code</label>
                                                    <input
                                                        id="userVerificationCode"
                                                        type="text"
                                                        value={this.state.userMobileVerificationCode}
                                                        maxLength={6}
                                                        placeholder="123456"
                                                        onChange={(e) => {
                                                            this.setState({ userMobileVerificationCode: e.target.value });
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    className={styles.verifyButton}
                                                    disabled={!(this.state.userMobileVerificationCode.length >= 6)}
                                                    style={{ marginTop: "12px" }}
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        toast.loading("");
                                                        return this.state.userConfirmationResult
                                                            .confirm(this.state.userMobileVerificationCode)
                                                            .then((userCred) => {
                                                                toast.dismiss();
                                                                if (userCred.user) {
                                                                    // Number verified
                                                                    console.log("number verified successfully");
                                                                    toast.success("Number verified successfully.");
                                                                    this.setState({ userMobileVerified: true });
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
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p>
                                        Your number is now verified!
                                        <br />
                                        Press the button below to contact a bank representative
                                    </p>
                                    <button
                                        className={styles.verifyButton}
                                        disabled={!(this.state.userMobileVerificationCode.length >= 6)}
                                        style={{ marginTop: "12px" }}
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            toast.loading("");

                                            // Save data to firestore
                                            await saveContactInfoToDB(
                                                this.state.loan,
                                                this.state.userMonthlySalary,
                                                this.state.sector,
                                                this.state.loanDurationInYears,
                                                this.state.apr,
                                                this.state.name,
                                                this.state.mobile,
                                                this.state.userMobile
                                            );

                                            toast.dismiss();
                                            // Redirect to whatsapp with predefined message
                                            const whatsappMessage = `Hi there,\nI wanted to reach out and apply for a loan at ${this.state.name}.\nThese are my application details:\n\n- Sector: ${this.state.sector}\n- Loan amount: ${this.state.loan}\n- Loan duration (in years): ${this.state.loanDurationInYears}\n- APR: ${this.state.apr}\n- Monthly Salary: ${this.state.userMonthlySalary}\n\nI am looking forward to hearing from you.\nKind regards.`;
                                            const encodedMessage = encodeURIComponent(whatsappMessage).replace(/\n/g, "%0a");
                                            return window.open(`https://wa.me/${this.state.mobile}?text=${encodedMessage}`);
                                        }}
                                    >
                                        Contact now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Bank;

// import React from "react";
// import Image from "next/image";
// import styles from "../styles/Bank.module.scss";
// import * as PrismaTypes from "@prisma/client";

// import {
//   ConfirmationResult,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase";
// import { toast } from "react-hot-toast";
// import { saveContactInfoToDB } from "../controller/Contact";
// import { useTranslation } from "react-i18next";

// export type BankType = {
//   id: number;
//   name: string;
//   logo: string;
//   mobile: string;
//   salaryTransfer: boolean;
//   minSalary: number;
//   minLoan: number;
//   offer: boolean;
//   aprValues: PrismaTypes.AprValue[];
// };

// export type Props = {
//   name: string;
//   logo: string;
//   mobile: string;
//   apr: number;
//   loan: number;
//   monthly: number;
//   total: number;
//   fees: number;
//   maxLoan: number;
//   salaryTransfer: boolean;
//   revenue: number;
//   minLoan: number;
//   offer: boolean;
//   useMaxLoan: boolean;

//   loanDurationInYears: number;
//   sector: string;
//   userMonthlySalary: number;
// };

// type State = {
//   name: string;
//   logo: string;
//   mobile: string;
//   apr: number;
//   loan: number;
//   monthly: number;
//   total: number;
//   fees: number;
//   maxLoan: number;
//   salaryTransfer: boolean;
//   revenue: number;
//   minLoan: number;
//   offer: boolean;
//   showDetails: boolean;

//   loanDurationInYears: number;
//   sector: string;
//   userMonthlySalary: number;

//   showContactPrompt: boolean;
//   userMobile: string;
//   recaptchaVerifier: RecaptchaVerifier;
//   userMobileVerificationCode: string;
//   userConfirmationResult: ConfirmationResult;
//   userMobileVerified: boolean;
// };
// class Bank extends React.Component<Props, State> {
//   constructor(props) {
//     super(props);

//     this.state = {
//       name: props.name || "",
//       logo: props.logo || "",
//       mobile: props.mobile || "",
//       apr: props.apr || 0,
//       loan: props.loan || 0,
//       monthly: props.monthly || 0,
//       total: props.total || 0,
//       fees: props.fees || 0,
//       maxLoan: props.maxLoan || 0,
//       salaryTransfer: props.salaryTransfer || false,
//       revenue: props.revenue || 0,
//       minLoan: props.minLoan || 0,
//       offer: props.offer || false,
//       showDetails: false,

//       loanDurationInYears: props.loanDurationInYears || 0,
//       sector: props.sector || "",
//       userMonthlySalary: props.userMonthlySalary || 0,

//       showContactPrompt: false,
//       userMobile: "",
//       recaptchaVerifier: null,
//       userMobileVerificationCode: "",
//       userConfirmationResult: null,
//       userMobileVerified: false,
//     };
//   }

//   formatNumber(value: string) {
//     return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   }
 

//   render() {
//     return (
//       <div className={styles.bank}>
//         <h6 className={styles.name}>{this.state.name}</h6>

//         <div className={styles.info}>
//           <button
//             className={`${styles.contact} ${styles.mobileHide}`}
//             onClick={() =>
//               this.setState({
//                 showContactPrompt: !this.state.showContactPrompt,
//               })
//             }
//           >
//            Cone<br /> Bank Representative
//           </button>

//           <button
//             className={`${styles.contact} ${styles.mobileShow}`}
//             onClick={() =>
//               this.setState({
//                 showContactPrompt: !this.state.showContactPrompt,
//               })
//             }
//           >
//              cone Bank Representative{" "}
//           </button>

//           <div className={styles.text}>
//             <h6>
//               {this.formatNumber(this.state.total.toFixed(0))}{" "}
//               <span style={{ fontSize: 13 }}>SAR</span>
//             </h6>
//             <p>Total Amount</p>
//           </div>

//           <div className={styles.text}>
//             <h6>
//               {this.formatNumber(this.state.monthly.toFixed(0))}{" "}
//               <span style={{ fontSize: 13 }}>SAR</span>
//             </h6>
//             <p>Monthly Installment</p>
//           </div>

//           <div className={styles.text}>
//             <h6>
//               {this.formatNumber(this.state.loan.toFixed(0))}{" "}
//               <span style={{ fontSize: 13 }}>SAR</span>
//             </h6>
//             <p>{this.props.useMaxLoan ? "Max Loan" : "Loan Amount"}</p>
//           </div>

//           <div className={`${styles.text} ${styles.mobileShow}`}>
//             <h6>
//               {this.state.fees.toFixed(0)}{" "}
//               <span style={{ fontSize: 13 }}>SAR</span>
//             </h6>
//             <p>Admin Fees</p>
//           </div>
//           <div className={styles.apr}>
//             <h6>
//               {this.state.apr.toFixed(2)}%<span>fixed</span>
//             </h6>
//             <p>Annual percentage rate (APR)</p>
//           </div>
//           <div className={styles.logo}>
//             <Image
//               src={this.state.logo}
//               alt=""
//               width={146}
//               height={60}
//               layout={"responsive"}
//             />
//           </div>
//         </div>

//         <div className={styles.details}>
//           {!this.state.showDetails ? (
//             <p className={styles.text}>
//               The APR may vary depending on the loan amount, salary, employer,
//               and term. It may be affected by each client’s credit scoring.
//             </p>
//           ) : (
//             <div className={styles.content}>
//               <div className={styles.features}>
//                 <h6>Features</h6>
//                 <ul className={styles.list}>
//                   <li>Shariah compliant.</li>
//                   <li>Instant approval.</li>
//                   <li>Repayment periods from 3 months up to 12 months.</li>
//                   <li>Possibility of early settlement.</li>
//                   <li>
//                     Possibility of postponing the installment of the month of
//                     Ramadan.
//                   </li>
//                 </ul>
//               </div>

//               <div className={`${styles.detail} ${styles.mobileHide}`}>
//                 <i className={styles.icon}>
//                   <svg
//                     viewBox="0 0 46 47"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
//                       fill="#EAEAEA"
//                     />
//                     <path
//                       d="M4.62769 3.65161V4.80934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M4.62769 8.28162V9.43934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M2 6.54541H3.05117"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M6.20367 6.54541H7.25484"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
//                       fill="#4C241D"
//                     />
//                     <path
//                       d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeDasharray="5.08 5.08"
//                     />
//                     <path
//                       d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 28.6364H18.7419"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </i>
//                 <h6>Admin Fees + Tax</h6>
//                 <p>{this.state.fees.toFixed(0)}</p>
//               </div>

//               <div className={styles.detail}>
//                 <i className={styles.icon}>
//                   <svg
//                     viewBox="0 0 46 47"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
//                       fill="#EAEAEA"
//                     />
//                     <path
//                       d="M4.62769 3.65161V4.80934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M4.62769 8.28162V9.43934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M2 6.54541H3.05117"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M6.20367 6.54541H7.25484"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
//                       fill="#4C241D"
//                     />
//                     <path
//                       d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeDasharray="5.08 5.08"
//                     />
//                     <path
//                       d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 28.6364H18.7419"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </i>
//                 <h6>Max Loan</h6>
//                 <p>{this.state.maxLoan.toFixed(0)}</p>
//               </div>

//               <div className={styles.detail}>
//                 <i className={styles.icon}>
//                   <svg
//                     viewBox="0 0 46 47"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
//                       fill="#EAEAEA"
//                     />
//                     <path
//                       d="M4.62769 3.65161V4.80934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M4.62769 8.28162V9.43934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M2 6.54541H3.05117"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M6.20367 6.54541H7.25484"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
//                       fill="#4C241D"
//                     />
//                     <path
//                       d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeDasharray="5.08 5.08"
//                     />
//                     <path
//                       d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 28.6364H18.7419"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </i>
//                 <h6>Salary Transfer</h6>
//                 <p>{this.state.salaryTransfer ? "Yes" : "No"}</p>
//               </div>

//               <div className={styles.detail}>
//                 <i className={styles.icon}>
//                   <svg
//                     viewBox="0 0 46 47"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
//                       fill="#EAEAEA"
//                     />
//                     <path
//                       d="M4.62769 3.65161V4.80934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M4.62769 8.28162V9.43934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M2 6.54541H3.05117"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M6.20367 6.54541H7.25484"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
//                       fill="#4C241D"
//                     />
//                     <path
//                       d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeDasharray="5.08 5.08"
//                     />
//                     <path
//                       d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 28.6364H18.7419"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </i>
//                 <h6>Bank&apos;s Profit</h6>
//                 <p>{this.state.revenue.toFixed(0)}</p>
//               </div>

//               <div className={styles.detail}>
//                 <i className={styles.icon}>
//                   <svg
//                     viewBox="0 0 46 47"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
//                       fill="#EAEAEA"
//                     />
//                     <path
//                       d="M4.62769 3.65161V4.80934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M4.62769 8.28162V9.43934"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M2 6.54541H3.05117"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M6.20367 6.54541H7.25484"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M13.1707 2.10193C13.6093 2.10193 13.9649 1.71035 13.9649 1.2273C13.9649 0.744249 13.6093 0.352661 13.1707 0.352661C12.7321 0.352661 12.3766 0.744249 12.3766 1.2273C12.3766 1.71035 12.7321 2.10193 13.1707 2.10193Z"
//                       fill="#4C241D"
//                     />
//                     <path
//                       d="M18.7421 40.0909H41.0284C41.6195 40.0909 42.1863 40.3495 42.6043 40.8099C43.0222 41.2702 43.257 41.8945 43.257 42.5455C43.257 43.1965 43.0222 43.8208 42.6043 44.2811C42.1863 44.7414 41.6195 45 41.0284 45H18.7421V40.0909Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 35.1819H39.5425C40.1336 35.1819 40.7004 35.4405 41.1184 35.9008C41.5363 36.3611 41.7711 36.9854 41.7711 37.6364C41.7711 38.2874 41.5363 38.9117 41.1184 39.3721C40.7004 39.8324 40.1336 40.091 39.5425 40.091H17.2562V35.1819Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 30.2727H41.0284C41.6195 30.2727 42.1863 30.5313 42.6043 30.9916C43.0222 31.4519 43.257 32.0763 43.257 32.7273C43.257 33.3782 43.0222 34.0026 42.6043 34.4629C42.1863 34.9232 41.6195 35.1818 41.0284 35.1818H18.7421V30.2727Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.9991 25.3636H40.2854C40.8765 25.3636 41.4434 25.6223 41.8613 26.0826C42.2793 26.5429 42.5141 27.1672 42.5141 27.8182C42.5141 28.4692 42.2793 29.0935 41.8613 29.5538C41.4434 30.0141 40.8765 30.2727 40.2854 30.2727H17.9991V25.3636Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 20.4546H38.0567C38.6477 20.4546 39.2146 20.7132 39.6326 21.1735C40.0505 21.6338 40.2853 22.2581 40.2853 22.9091C40.2853 23.5601 40.0505 24.1844 39.6326 24.6448C39.2146 25.1051 38.6477 25.3637 38.0567 25.3637H15.7704V20.4546Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.2562 15.5455H39.5425C40.1336 15.5455 40.7004 15.8041 41.1184 16.2645C41.5363 16.7248 41.7711 17.3491 41.7711 18.0001C41.7711 18.6511 41.5363 19.2754 41.1184 19.7357C40.7004 20.196 40.1336 20.4546 39.5425 20.4546H17.2562V15.5455Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M21.7137 10.6364H41.7713C42.3624 10.6364 42.9293 10.895 43.3472 11.3553C43.7652 11.8156 44 12.4399 44 13.0909C44 13.7419 43.7652 14.3662 43.3472 14.8265C42.9293 15.2868 42.3624 15.5454 41.7713 15.5454H19.485V13.0909C19.485 12.4399 19.7198 11.8156 20.1378 11.3553C20.5557 10.895 21.1226 10.6364 21.7137 10.6364Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M37.3143 5.72729H17.2566C16.0258 5.72729 15.028 6.82623 15.028 8.18184C15.028 9.53745 16.0258 10.6364 17.2566 10.6364H37.3143C38.5451 10.6364 39.5429 9.53745 39.5429 8.18184C39.5429 6.82623 38.5451 5.72729 37.3143 5.72729Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7421 45C26.5374 45 32.8567 38.04 32.8567 29.4545C32.8567 20.869 26.5374 13.9091 18.7421 13.9091C10.9468 13.9091 4.62744 20.869 4.62744 29.4545C4.62744 38.04 10.9468 45 18.7421 45Z"
//                       fill="#FFCE56"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M18.7418 40.9091C24.4857 40.9091 29.1421 35.7807 29.1421 29.4545C29.1421 23.1284 24.4857 18 18.7418 18C12.9979 18 8.34155 23.1284 8.34155 29.4545C8.34155 35.7807 12.9979 40.9091 18.7418 40.9091Z"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeDasharray="5.08 5.08"
//                     />
//                     <path
//                       d="M20.7751 24.5512C20.6451 24.3008 20.4572 24.0927 20.2306 23.948C20.004 23.8033 19.7467 23.7272 19.4848 23.7273H18.9603C18.3113 23.7273 17.6889 24.0112 17.23 24.5167C16.7711 25.0221 16.5133 25.7076 16.5133 26.4224L16.8505 28.5423C17.999 31.0909 16.2577 31.9345 15.7704 33.5455H21.7134V31.9091"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M15.7704 28.6364H18.7419"
//                       stroke="#4C241D"
//                       strokeWidth="2.54276"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </i>
//                 <h6>Min Loan</h6>
//                 <p>{this.state.minLoan.toFixed(0)}</p>
//               </div>
//             </div>
//           )}

//           <button
//             style={
//               this.state.showDetails ? { marginLeft: 25 } : { marginLeft: 10 }
//             }
//             onClick={() =>
//               this.setState({ showDetails: !this.state.showDetails })
//             }
//           >
//             {this.state.showDetails ? "Hide" : "Details"}
//             <i className={styles.icon}>
//               {!this.state.showDetails ? (
//                 <svg
//                   style={{ marginBottom: 2 }}
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 512 512"
//                 >
//                   <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
//                 </svg>
//               ) : (
//                 <svg
//                   style={{ marginTop: 2 }}
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 512 512"
//                 >
//                   <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
//                 </svg>
//               )}
//             </i>
//           </button>
//         </div>

//         {/* Mobile Verification Form */}
//         {this.state.showContactPrompt && (
//           <div
//             className={styles.phoneContact}
//             onClick={() =>
//               this.setState({
//                 showContactPrompt: !this.state.showContactPrompt,
//               })
//             }
//           >
//             <div
//               className={styles.contentDiv}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {!this.state.userMobileVerified ? (
//                 <div>
//                   <p>
//                     In order to contact a bank representative you will have to
//                     verify your number via sms first.
//                   </p>
//                   <div style={{ marginTop: "36px" }}>
//                     {!this.state.userConfirmationResult ? (
//                       <div>
//                         <div className={styles.inputContainer}>
//                           <label htmlFor="userMobile">Phone Number</label>
//                           <input
//                             id="userMobile"
//                             type="tel"
//                             value={this.state.userMobile}
//                             placeholder="+966569599298"
//                             onChange={(e) => {
//                               const parsedMobile = e.target.value;
//                               this.setState({ userMobile: parsedMobile });
//                             }}
//                           />
//                         </div>

//                         <div id="recaptcha-container"></div>
//                         <button
//                           className={styles.verifyButton}
//                           style={{ marginTop: "12px" }}
//                           disabled={!(this.state.userMobile.length > 0)}
//                           onClick={async (e) => {
//                             e.preventDefault();
//                             try {
//                               toast.loading("");
//                               console.log("clicked");

//                               const captcha = new RecaptchaVerifier(
//                                 "recaptcha-container",
//                                 {
//                                   size: "invisible",
//                                   callback: () => {
//                                     // This will be called when the reCAPTCHA widget is completed
//                                   },
//                                 },
//                                 firebaseAuth
//                               );

//                               return signInWithPhoneNumber(
//                                 firebaseAuth,
//                                 this.state.userMobile,
//                                 captcha
//                               )
//                                 .then(async (confirmationResult) => {
//                                   console.log("Code sent");
//                                   toast.dismiss();
//                                   toast.success("Code sent.");

//                                   captcha.clear();
//                                   return this.setState({
//                                     userConfirmationResult: confirmationResult,
//                                   });
//                                 })
//                                 .catch((error) => {
//                                   console.log(
//                                     "Something went wrong signing in with phone number: " +
//                                       error
//                                   );
//                                   toast.dismiss();
//                                   toast.error(
//                                     "Something went wrong. Try again later."
//                                   );
//                                 });
//                             } catch (error) {
//                               console.log(
//                                 "Something went wrong with phone sign in or recaptcha: " +
//                                   error
//                               );
//                             }
//                           }}
//                         >
//                           Send verification code
//                         </button>
//                       </div>
//                     ) : (
//                       <div style={{ marginTop: "24px" }}>
//                         <div className={styles.inputContainer}>
//                           <label htmlFor="userMobile">Verification code</label>
//                           <input
//                             id="userVerificationCode"
//                             type="text"
//                             value={this.state.userMobileVerificationCode}
//                             maxLength={6}
//                             placeholder="123456"
//                             onChange={(e) => {
//                               this.setState({
//                                 userMobileVerificationCode: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                         <button
//                           className={styles.verifyButton}
//                           disabled={
//                             !(this.state.userMobileVerificationCode.length >= 6)
//                           }
//                           style={{ marginTop: "12px" }}
//                           onClick={async (e) => {
//                             e.preventDefault();
//                             toast.loading("");
//                             return this.state.userConfirmationResult
//                               .confirm(this.state.userMobileVerificationCode)
//                               .then((userCred) => {
//                                 toast.dismiss();
//                                 if (userCred.user) {
//                                   // Number verified
//                                   console.log("number verified successfully");
//                                   toast.success(
//                                     "Number verified successfully."
//                                   );
//                                   this.setState({ userMobileVerified: true });
//                                 }
//                               })
//                               .catch((error) => {
//                                 // Wrong verification code?
//                                 console.log(
//                                   "Something went wrong signing in with phone number: " +
//                                     "This might be the wrong verification code"
//                                 );
//                                 toast.dismiss();
//                                 toast.error("Incorrect verification code.");
//                               });
//                           }}
//                         >
//                           Verifiy code
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   <p>
//                     Your number is now verified!
//                     <br />
//                     Press the button below to contact a bank representative
//                   </p>
//                   <button
//                     className={styles.verifyButton}
//                     disabled={
//                       !(this.state.userMobileVerificationCode.length >= 6)
//                     }
//                     style={{ marginTop: "12px" }}
//                     onClick={async (e) => {
//                       e.preventDefault();
//                       toast.loading("");

//                       // Save data to firestore
//                       await saveContactInfoToDB(
//                         this.state.loan,
//                         this.state.userMonthlySalary,
//                         this.state.sector,
//                         this.state.loanDurationInYears,
//                         this.state.apr,
//                         this.state.name,
//                         this.state.mobile,
//                         this.state.userMobile
//                       );

//                       toast.dismiss();
//                       // Redirect to whatsapp with predefined message
//                       const whatsappMessage = `Hi there,\nI wanted to reach out and apply for a loan at ${this.state.name}.\nThese are my application details:\n\n- Sector: ${this.state.sector}\n- Loan amount: ${this.state.loan}\n- Loan duration (in years): ${this.state.loanDurationInYears}\n- APR: ${this.state.apr}\n- Monthly Salary: ${this.state.userMonthlySalary}\n\nI am looking forward to hearing from you.\nKind regards.`;
//                       const encodedMessage = encodeURIComponent(
//                         whatsappMessage
//                       ).replace(/\n/g, "%0a");
//                       return window.open(
//                         `https://wa.me/${this.state.mobile}?text=${encodedMessage}`
//                       );
//                     }}
//                   >
//                     Contact now
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default Bank;
