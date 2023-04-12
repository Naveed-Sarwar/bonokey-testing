import { brandColors, urlPaths } from "../../utils/helpers";
import React from "react";
import styled from "styled-components";
import Link from "next/link";

type Props = {};

const ContentContainerDiv = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 12px;
`;

const ContactDiv = styled.div`
    width: 100%;
    padding: 48px;
    text-align: center;
    border-radius: 10px;

    background: linear-gradient(90deg, ${brandColors.purple} 0%, ${brandColors.lighterPurple} 100%);
`;

const Headline = styled.p`
    font-size: 2rem;
    font-weight: 800;
    color: ${brandColors.white};
`;

const Caption = styled.p`
    font-size: 1rem;
    font-weight: 500;
    color: ${brandColors.white}90;
`;

const ContactButton = styled.button`
    all: unset;
    cursor: pointer;
    color: ${brandColors.black};
    background-color: ${brandColors.white};

    padding: 10px;
    border-radius: 5px;
    text-align: center;

    &:hover:enabled {
        background: none;
        color: ${brandColors.white};
        background-color: ${brandColors.transparent};
        outline: 3px solid ${brandColors.white};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.75;
    }
`;

function Contact(props: Props) {
    return (
        <ContentContainerDiv>
            <ContactDiv data-aos="fade-up">
                <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <Headline id="contact-section" style={{ marginBottom: "12px" }}>
                        Still have questions?
                    </Headline>
                    <Caption>
                        We offer you free consultations with a finance expert and consultant who will answer all your questions and assist you in the personal financial planning process.
                    </Caption>

                    <Link href={urlPaths.contact} passHref>
                        <ContactButton style={{ marginTop: "24px" }}>Contact us</ContactButton>
                    </Link>
                </div>
            </ContactDiv>
        </ContentContainerDiv>
    );
}

export default Contact;
