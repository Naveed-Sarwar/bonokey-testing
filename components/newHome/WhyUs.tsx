import { brandColors, uiBreakpoint } from "../../utils/helpers";
import React from "react";
import styled from "styled-components";
import { FaSearchDollar, FaTrophy, FaPhoneVolume } from "react-icons/fa";

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
    color: ${brandColors.black};
`;

const Caption = styled.h2`
    font-size: 1rem;
    font-weight: 500;
    color: ${brandColors.captionBlack};
`;

function WhyUs(props: Props) {
    return (
        <BackgroundDiv>
            <ContentContainerDiv data-aos="fade-up" data-aos-delay="600">
                <Headline style={{ marginBottom: "48px" }} id="why-us-section">
                    Why choose us?
                </Headline>
                <GridDiv>
                    <HighlightDiv>
                        <FaSearchDollar size={40} color={brandColors.black} style={{ marginBottom: "24px" }} />
                        <HighlightHeadline style={{ marginBottom: "12px" }}>Find & compare</HighlightHeadline>
                        <Caption>Easily find and compare the best product that fits your needs and learn its benefits and features.</Caption>
                    </HighlightDiv>
                    <HighlightDiv>
                        <FaTrophy size={40} color={brandColors.black} style={{ marginBottom: "24px" }} />
                        <HighlightHeadline style={{ marginBottom: "12px" }}>Best rates</HighlightHeadline>
                        <Caption>Lowest APR rate and financial products offers that are exclusive only on Bonokey and match your profile.</Caption>
                    </HighlightDiv>
                    <HighlightDiv>
                        <FaPhoneVolume size={40} color={brandColors.black} style={{ marginBottom: "24px" }} />
                        <HighlightHeadline style={{ marginBottom: "12px" }}>Financial advisor</HighlightHeadline>
                        <Caption>You need to speak to expert to help you understand and help you in your financial needs? We get you covered.</Caption>
                    </HighlightDiv>
                </GridDiv>
            </ContentContainerDiv>
        </BackgroundDiv>
    );
}

export default WhyUs;
