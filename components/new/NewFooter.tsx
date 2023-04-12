import { brandColors } from "../../utils/helpers";
import React from "react";
import styled from "styled-components";
import Link from "next/link";

type Props = {};

const ContentContainerDiv = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding-top: 48px;
    padding-left: 12px;
    padding-right: 12px;
    padding-bottom: 12px;

    text-align: center;
`;

const Text = styled.p`
    color: ${brandColors.captionBlack};
    font-size: 0.9rem;
    font-weight: 300;
`;

const DividerTop = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg);

    & > svg {
        position: relative;
        display: block;
        width: calc(100% + 1.3px);
        height: 61px;

        & > path {
            fill: ${brandColors.white};
        }
    }
`;

const MyList = styled.ul`
    list-style: none;
    margin-top: 12px;
`;

const MyFooterA = styled.a`
    text-decoration: none;
    text-align: center;

    color: ${brandColors.captionBlack};
    font-size: 0.9rem;
    font-weight: 300;

    &:hover {
        text-decoration: underline;
    }
`;

function NewFooter(props: Props) {
    return (
        <div style={{ position: "relative", backgroundColor: brandColors.captionBlack + "12", marginTop: "48px" }}>
            <DividerTop>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M741,116.23C291,117.43,0,27.57,0,6V120H1200V6C1200,27.93,1186.4,119.83,741,116.23Z"></path>
                </svg>
            </DividerTop>
            <ContentContainerDiv>
                <MyList style = {{ marginBottom: "24px" }}>
                    <li style={{ marginBottom: "12px" }}>
                        <Link href="/" passHref>
                            <MyFooterA>سياسة الخصوصية</MyFooterA>
                        </Link>
                    </li>
                </MyList>
                <Text>
                Copyright © 2023 Bonokey. All rights reserved.                    </Text>
            </ContentContainerDiv>
        </div>
    );
}

export default NewFooter;
