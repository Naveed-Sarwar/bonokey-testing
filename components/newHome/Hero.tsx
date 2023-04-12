import { brandColors, uiBreakpoint } from "../../utils/helpers";
import React from "react";
import styled from "styled-components";

import MoneyImage from "../../img/Money.png";

type Props = {};

const ContentContainerDiv = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 12px;
`;

const HeroGridDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    /* PHONE UI */
    @media only screen and (max-width: ${uiBreakpoint}px) {
        grid-template-columns: 1fr;
    }
`;

const HeroImageDiv = styled.div`
    display: grid;
    justify-content: center;
    align-content: center;

    /* PHONE UI */
    @media only screen and (max-width: ${uiBreakpoint}px) {
        grid-row: 0;
    }
`;

const HeroImage = styled.img`
    transform: scale(-1, 1);
    width: 100%;
    margin: 0 auto;

    /* PHONE UI */
    @media only screen and (max-width: ${uiBreakpoint}px) {
        max-width: 70%;
    }
    @media only screen and (max-width: 640px) {
        max-width: 80%;
    }
`;

const TextDiv = styled.div`
    text-align: left;

    display: grid;
    justify-content: center;
    align-content: center;

    /* PHONE UI */
    @media only screen and (max-width: ${uiBreakpoint}px) {
        text-align: center;
    }
`;

const Headline = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    color: ${brandColors.black};
`;

const Caption = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: ${brandColors.red};
`;

const GradientFlair = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;

    position: absolute;
    align-self: center;
    justify-self: center;

    background: radial-gradient(50% 50% at 50% 50%, rgba(192, 70, 117, 0.06) 0%, rgba(192, 70, 117, 0) 100%);
    z-index: -999;
`;

function Hero(props: Props) {
    return (
        <ContentContainerDiv>
            <div style={{ margin: "100px 0" }}>
                <HeroGridDiv>
                    <TextDiv data-aos="fade-right">
                        <Headline style={{ marginBottom: "12px" }}>Compare the best loan offers from different banks</Headline>
                        <Caption>Best rates guarantee</Caption>
                    </TextDiv>
                    <HeroImageDiv data-aos="fade-left">
                        <HeroImage src={MoneyImage.src} alt="Bonokey - Best loan offer comparisons hero image" />
                        <GradientFlair />
                    </HeroImageDiv>
                </HeroGridDiv>
            </div>
        </ContentContainerDiv>
    );
}

export default Hero;
