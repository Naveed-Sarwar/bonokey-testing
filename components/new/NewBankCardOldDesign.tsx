import React, { useEffect } from "react";
import styles from "../../styles/NewBank.module.scss";
import Image from "next/image";
import { AprValue } from "@prisma/client";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { saveContactInfoToDB } from "../../controller/Contact";
import toast from "react-hot-toast";
import { firebaseAuth, firebaseCaptcha } from "../../utils/firebase";
import styled from "styled-components";
import { brandColors } from "../../utils/helpers";
import { FaTimes } from "react-icons/fa";

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
  background: linear-gradient(
    90deg,
    ${brandColors.purple} 0%,
    ${brandColors.lighterPurple} 100%
  );

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

function formatNumber(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function NewBankCardOldDesign(props: Props) {
  const [showDetail, setShowDetail] = React.useState(false);
  const [showContactPrompt, setShowContactPrompt] = React.useState(false);

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [phoneNumberConfirmationResult, setPhoneNumberConfirmationResult] =
    React.useState<ConfirmationResult>(null);
  const [phoneNumberVerificationCode, setPhoneNumberVerificationCode] =
    React.useState("");

  async function verifyCodeAndSendWhatsApp() {
    toast.loading("");
    return phoneNumberConfirmationResult
      .confirm(phoneNumberVerificationCode)
      .then(async (userCred) => {
        toast.dismiss();
        if (userCred.user) {
          // Number verified
          console.log("number verified successfully");
          toast.success("Number verified successfully.");
          props.setPhoneNumberVerified(true);

          // Send to whatsapp
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
          const encodedMessage = encodeURIComponent(whatsappMessage).replace(
            /\n/g,
            "%0a"
          );

          return window.open(
            `https://wa.me/${props.bank.mobile}?text=${encodedMessage}`
          );
        }
      })
      .catch((error) => {
        // Wrong verification code?
        console.log(
          "Something went wrong signing in with phone number: " +
            "This might be the wrong verification code"
        );
        toast.dismiss();
        toast.error("Incorrect verification code.");
      });
  }

  useEffect(() => {
    if (phoneNumberVerificationCode.length >= 6) {
      verifyCodeAndSendWhatsApp();
    }
  }, [phoneNumberVerificationCode]);

  return (
    <div className={styles.bank}>
      <h6 className={styles.name}>{props.bank.name}</h6>

      <div className={styles.info}>
        <div className={styles.logo}>
          <Image
            src={props.bank.logo}
            alt=""
            width={146}
            height={60}
            layout={"responsive"}
          />
        </div>

        <div className={styles.apr}>
          <h6>
            {props.bank.apr.toFixed(2)}%<span>ثابتة</span>
          </h6>
          <p>معدل النسبة السنوي (APR)</p>
        </div>

        <div className={styles.text}>
          <div>
            <h6>{formatNumber(props.bank.loan.toFixed(0))}</h6>
            <p>ريال سعودي</p>
          </div>
          <p>{props.bank.useMaxLoan ? "ماكس القرض" : "مبلغ التمويل"}</p>
        </div>

        <div className={styles.text}>
          <div>
            <h6>{formatNumber(props.bank.monthly.toFixed(0))}</h6>
            <p>ريال سعودي</p>
          </div>
          <p>القسط الشهري</p>
        </div>

        <div className={styles.text}>
          {/* <h6></h6> */}
          <div>
            <h6>{formatNumber(props.bank.total.toFixed(0))}</h6>
            <p>ريال سعودي</p>
          </div>
          <p>المستحقات الاجمالية</p>
        </div>

        <div className={`${styles.text} ${styles.mobileShow}`}>
          <div>
            <h6>{props.bank.fees.toFixed(0)}</h6>
            <p>ريال سعودي</p>
          </div>
          <p>Admin Fees</p>
        </div>

        <button
          className={`${styles.contact} ${styles.mobileHide}`}
          onClick={() => setShowContactPrompt(!showContactPrompt)}
        >
          التواصل مع ممثل <br /> البنك{" "}
        </button>

        <button
          className={`${styles.contact} ${styles.mobileShow}`}
          onClick={() => setShowContactPrompt(!showContactPrompt)}
        >
          Contact Bank Representative
        </button>
      </div>

      <div className={styles.details}>
        <div style={{ margin: "0 auto" , direction: "rtl" }}>
          <p className={styles.text}>
            قد يختلف معدل النسبة السنوي اعتماداً على مبلغ التمويل والراتب وجهة
            العمل ومدة استحقاق التمويل المختلفة وقد تتأثر بالسجل الائتماني الخاص
            لكل عميل
            {/* The APR may vary depending on the loan amount, salary, employer, and
            term. It may be affected by each client’s credit scoring. */}
          </p>
          {showDetail && (
            <div className={styles.content}>
              <div className={styles.features}>
                {/* <h6>Features</h6> */}
                <h5>مميزات التمويل الشخصي</h5>
                <ul className={styles.list}>
                  {/* <li>Shariah compliant.</li> */}
                  <li>متوافق مع احكام الشريعة</li>
                  <li>هامش ربح تنافسي وثابت طوال فترة التمويل</li>
             <li>إيداع سريع للمبلغ خلال 24 ساعة</li>
             <li>إمكانية التسوية المبكرة</li>
             <li>امكانية تأجيل تقسيط شهر رمضان</li>
                  {/* <li>Instant approval.</li> */}
                  {/* <li>Repayment periods from 3 months up to 12 months.</li>
                  <li>Possibility of early settlement.</li> */}
                  <li style={{visibility: "hidden"}}>
                    Possibility of postponing the installment of the month of
                    Ramadan.
                  </li>
                </ul>
              </div>

              <div className={`${styles.detail} ${styles.mobileHide}`}>
                <i className={styles.icon}>
                  <svg
                    viewBox="0 0 46 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                      fill="#EAEAEA"
                    />
                    <path
                      d="M4.62769 3.65161V4.80934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.62769 8.28162V9.43934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 6.54541H3.05117"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.20367 6.54541H7.25484"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                    <path
                      d="M15.7704 28.6364H18.7419"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
                {/* <h6>Admin Fees + Tax</h6> */}
                <h6>الرسوم الادارية</h6>
                <p>{props.bank.fees.toFixed(0)}</p>
              </div>

              <div className={styles.detail}>
                <i className={styles.icon}>
                  <svg
                    viewBox="0 0 46 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                      fill="#EAEAEA"
                    />
                    <path
                      d="M4.62769 3.65161V4.80934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.62769 8.28162V9.43934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 6.54541H3.05117"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.20367 6.54541H7.25484"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                    <path
                      d="M15.7704 28.6364H18.7419"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
                {/* <h6>Max Loan</h6> */}
                <h6>الحد الاعلى للتمويل</h6>
                <p>{props.bank.maxLoan.toFixed(0)}</p>
              </div>

              <div className={styles.detail}>
                <i className={styles.icon}>
                  <svg
                    viewBox="0 0 46 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                      fill="#EAEAEA"
                    />
                    <path
                      d="M4.62769 3.65161V4.80934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.62769 8.28162V9.43934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 6.54541H3.05117"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.20367 6.54541H7.25484"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                    <path
                      d="M15.7704 28.6364H18.7419"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
                {/* <h6>Salary Transfer</h6> */}
                <h6>تحويل الراتب</h6>
                <p>{props.bank.salaryTransfer ? "Yes" : "No"}</p>
              </div>

              <div className={styles.detail}>
                <i className={styles.icon}>
                  <svg
                    viewBox="0 0 46 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                      fill="#EAEAEA"
                    />
                    <path
                      d="M4.62769 3.65161V4.80934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.62769 8.28162V9.43934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 6.54541H3.05117"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.20367 6.54541H7.25484"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                    <path
                      d="M15.7704 28.6364H18.7419"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
                <h6>ربح  <br /> البنك</h6>
                {/* <h6>Bank&apos;s Profit</h6> */}
                <p>{props.bank.revenue.toFixed(0)}</p>
              </div>

              <div className={styles.detail}>
                <i className={styles.icon}>
                  <svg
                    viewBox="0 0 46 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.3707 35.1818C27.1917 35.1818 34.3426 27.3061 34.3426 17.5909C34.3426 7.87572 27.1917 0 18.3707 0C9.5497 0 2.39886 7.87572 2.39886 17.5909C2.39886 27.3061 9.5497 35.1818 18.3707 35.1818Z"
                      fill="#EAEAEA"
                    />
                    <path
                      d="M4.62769 3.65161V4.80934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.62769 8.28162V9.43934"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 6.54541H3.05117"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.20367 6.54541H7.25484"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                    <path
                      d="M15.7704 28.6364H18.7419"
                      stroke="#4C241D"
                      strokeWidth="2.54276"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
                <h6>أقل مبلغ تمويل</h6>
                {/* <h6>Min Loan</h6> */}
                <p>{props.bank.minLoan.toFixed(0)}</p>
              </div>
            </div>
          )}
        </div>

        <button
          style={showDetail ? { marginLeft: 25 } : { marginLeft: 10 }}
          onClick={() => setShowDetail(!showDetail)}
        >
                    {/* {showDetail ? "Hide" : "Details"} */}

          {showDetail ? "اخفاء" : "التفاصيل"}
          <i className={styles.icon}>
            {!showDetail ? (
              <svg
                style={{ marginBottom: 2 }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
              </svg>
            ) : (
              <svg
                style={{ marginTop: 2 }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
              </svg>
            )}
          </i>
        </button>
      </div>
      {/* Contact Prompt */}
      {showContactPrompt && (
        <PromptDiv onClick={() => setShowContactPrompt(!showContactPrompt)}>
          <div onClick={(e) => e.stopPropagation()}>
            <PromptContentDiv>
              <div style={{ textAlign: "right", marginBottom: "24px" }}>
                <FaTimes
                  color={brandColors.black}
                  size={25}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowContactPrompt(!showContactPrompt)}
                />
              </div>
              <PromptText>
                من أجل الاتصال بأحد ممثلي البنك ، يجب عليك التحقق من رقمك عبر
                الرسائل القصيرة أولاً
              </PromptText>
              {/* <PromptText>In order to contact a bank representative you will have to verify your number via sms first.</PromptText> */}
              <div style={{ marginTop: "24px" }}>
                {!phoneNumberConfirmationResult ? (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          fontWeight: "500",
                          color: brandColors.black,
                        }}
                      >
                        +966
                      </p>
                      <PromptInput
                        id="userMobile"
                        type="tel"
                        value={phoneNumber.replace("+966", "")}
                        placeholder="504123456"
                        onChange={(e) => {
                          const regex = /^[0-9+]+$/;
                          const parsedMobile = "+966" + e.target.value;

                          if (parsedMobile === "" || regex.test(parsedMobile)) {
                            setPhoneNumber(parsedMobile);
                          }
                        }}
                        style={{ textAlign: "left" }}
                      />
                    </div>

                    <PromptButton
                      style={{ marginTop: "24px" }}
                      disabled={!(phoneNumber.replace("+966", "").length > 0)}
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          toast.loading("");
                          console.log("clicked");

                          return signInWithPhoneNumber(
                            firebaseAuth,
                            phoneNumber,
                            firebaseCaptcha
                          )
                            .then(async (confirmationResult) => {
                              console.log("Code sent");
                              toast.dismiss();
                              toast.success("Code sent.");

                              return setPhoneNumberConfirmationResult(
                                confirmationResult
                              );
                            })
                            .catch((error) => {
                              console.log(
                                "Something went wrong signing in with phone number: " +
                                  error
                              );
                              toast.dismiss();
                              toast.error(
                                "Something went wrong. Try again later."
                              );
                            });
                        } catch (error) {
                          console.log(
                            "Something went wrong with phone sign in or recaptcha: " +
                              error
                          );
                        }
                      }}
                    >
                      أرسل رمز التحقق
                      {/* Send verification code */}
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
                      style={{ marginTop: "24px" }}
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          toast.loading("");
                          console.log("clicked");

                          // const currentCaptcha = new RecaptchaVerifier(
                          //     "recaptcha-container",
                          //     {
                          //         size: "invisible",
                          //         callback: () => {
                          //             // This will be called when the reCAPTCHA widget is completed
                          //         },
                          //     },
                          //     firebaseAuth
                          // );

                          return signInWithPhoneNumber(
                            firebaseAuth,
                            phoneNumber,
                            firebaseCaptcha
                          )
                            .then(async (confirmationResult) => {
                              console.log("Code sent");
                              toast.dismiss();
                              toast.success("Code sent.");

                              return setPhoneNumberConfirmationResult(
                                confirmationResult
                              );
                            })
                            .catch((error) => {
                              console.log(
                                "Something went wrong signing in with phone number: " +
                                  error
                              );
                              toast.dismiss();
                              toast.error(
                                "Something went wrong. Try again later."
                              );
                            });
                        } catch (error) {
                          console.log(
                            "Something went wrong with phone sign in or recaptcha: " +
                              error
                          );
                        }
                      }}
                    >
                      Resend code
                    </PromptButton>
                  </div>
                )}
              </div>
            </PromptContentDiv>
          </div>
        </PromptDiv>
      )}
    </div>
  );
}

export default NewBankCardOldDesign;
