import { brandColors, uiBreakpoint } from "../../utils/helpers";
import React from "react";
import styled from "styled-components";
import RiyadBankLogo from "../../img/Riyad-bank.png";
import SaudiNationalBankLogo from "../../img/Saudi-national-bank-2.png";
import ArabNationalBankLogo from "../../img/Arab-national-bank-2.png";
import AlRajhiBankLogo from "../../img/Al-rajhi-bank.png";
import { useTranslation } from "react-i18next";

type Props = {};

const ContentContainerDiv = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 12px;
`;

const Headline = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  color: ${brandColors.black};

  text-align: center;
`;

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    grid-template-columns: 1fr;
  }
`;

const OfferDiv = styled.div`
  background-color: ${brandColors.red}12;
  border-radius: 12px;
  padding: 24px;

  transition: transform 0.15s;
  &:hover {
    transform: scale(1.01);
  }
`;

const BankHeadline = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: ${brandColors.black};
`;

const BankCaption = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${brandColors.captionBlack};
`;

function NewOffers(props: Props) {
  const { t } = useTranslation();

  return (
    <ContentContainerDiv
      data-aos="fade-up"
      style={{ marginTop: "100px", marginBottom: "200px" }}
    >
      <Headline id="offer-section">العروض</Headline>
      <GridDiv style={{ marginTop: "48px" }}>
        <OfferDiv>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img src={RiyadBankLogo.src} alt="" style={{ width: "30px" }} />
            <div style={{ textAlign: "right" }}>
              <BankHeadline style={{ marginBottom: "6px" }}>
              بنك الرياض            
              </BankHeadline>
              <BankCaption>شراء مديونية %2.4</BankCaption>
            </div>
          </div>
        </OfferDiv>
        <OfferDiv>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={ArabNationalBankLogo.src}
              alt=""
              style={{ width: "60px" }}
            />
            <div style={{ textAlign: "right" }}>
              <BankHeadline style={{ marginBottom: "6px" }}>
                البنك العربي الوطني
              </BankHeadline>
              <BankCaption>تمويل شخصي %3.2 </BankCaption>
            </div>
          </div>
        </OfferDiv>
        <OfferDiv>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={SaudiNationalBankLogo.src}
              alt=""
              style={{ width: "60px" }}
            />
            <div style={{ textAlign: "right" }}>
              <BankHeadline style={{ marginBottom: "6px" }}>
              البنك الأهلي السعودي              </BankHeadline>
              <BankCaption>تمويل الاجارة للسيارات %3.1</BankCaption>
            </div>
          </div>
        </OfferDiv>
        <OfferDiv>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img src={AlRajhiBankLogo.src} alt="" style={{ width: "30px" }} />
            <div style={{ textAlign: "right" }}>
              <BankHeadline style={{ marginBottom: "6px" }}>
              مصرف الراجحي              </BankHeadline>
              <BankCaption>تمويل عقاري %2.8</BankCaption>
            </div>
          </div>
        </OfferDiv>
      </GridDiv>
    </ContentContainerDiv>
  );
}

export default NewOffers;
