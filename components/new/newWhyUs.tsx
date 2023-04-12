import { brandColors, uiBreakpoint } from "../../utils/helpers";
import React from "react";
import styled from "styled-components";
import { FaSearchDollar, FaTrophy, FaPhoneVolume } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type Props = {};

const BackgroundDiv = styled.div`
  padding: 0 12px;
  background-color: ${brandColors.captionBlack}12;

  z-index: 900;
  position: relative;
`;

const ContentContainerDiv = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 200px;
  padding-bottom: 100px;

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    padding-top: 195px;
  }
`;

const Headline = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  color: ${brandColors.black};

  text-align: center;
`;

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    grid-template-columns: 1fr;
  }
`;

const HighlightDiv = styled.div`
  background-color: ${brandColors.white};
  padding: 48px 24px;
  border-radius: 10px;

  box-shadow: 0px 0px 12px 5px ${brandColors.black}6;

  transition: transform 0.2s;
  &:hover {
    transform: scale(1.01);
  }
`;

const HighlightHeadline = styled.h1`
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  color: ${brandColors.black};
`;

const Caption = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: ${brandColors.captionBlack};
`;

function NewWhyUs(props: Props) {
  const { t } = useTranslation();

  return (
    <BackgroundDiv>
      <ContentContainerDiv data-aos="fade-up" data-aos-delay="600">
        <Headline style={{ marginBottom: "48px" }} id="why-us-section">
          لماذا بنوكي؟
        </Headline>
        <GridDiv>
          <HighlightDiv>
            <FaSearchDollar
              size={40}
              color={brandColors.black}
              style={{
                marginBottom: "24px",
                display: "flex",
                margin: "10px auto",
                justifyContent: "center",
              }}
            />
            <HighlightHeadline style={{ marginBottom: "12px" }}>
              مستشار مالي{" "}
            </HighlightHeadline>
            <Caption>
              نقدم لك استشارة مالية مبنية على البيانات والارقام الخاصة بك لتعرف
              وضعك المالي بشكل دقيق.{" "}
            </Caption>
          </HighlightDiv>
          <HighlightDiv>
            <FaTrophy
              size={40}
              color={brandColors.black}
              style={{
                marginBottom: "24px",
                display: "flex",
                margin: "10px auto",
              }}
            />
            <HighlightHeadline style={{ marginBottom: "12px" }}>
              أفضل النسب{" "}
            </HighlightHeadline>
            <Caption>
              أقل النسب وأفضل العروض الحصرية فقط على تطبيق بنوكي{" "}
            </Caption>
          </HighlightDiv>
          <HighlightDiv>
            <FaPhoneVolume
              size={40}
              color={brandColors.black}
              style={{
                marginBottom: "24px",
                display: "flex",
                margin: "10px auto",
              }}
            />
            <HighlightHeadline style={{ marginBottom: "12px" }}>
            البحث والمقارنة            </HighlightHeadline>
            <Caption>اعثر بسهولة على أفضل منتج يناسب احتياجاتك وقارن بينها وتعرّف على فوائده ومميزاته.</Caption>
          </HighlightDiv>
        </GridDiv>
      </ContentContainerDiv>
    </BackgroundDiv>
  );
}

export default NewWhyUs;
