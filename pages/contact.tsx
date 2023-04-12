import React from "react";
import styled from "styled-components";
import { brandColors } from "../utils/helpers";

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
`;

const Caption = styled.h2`
    font-size: 1rem;
    font-weight: 500;
    color: ${brandColors.captionBlack};
`;

const TextFieldInput = styled.input`
    all: unset;

    padding: 12px;
    font-size: 1rem;
    font-weight: 500;
    color: ${brandColors.black};
    background-color: ${brandColors.white};

    border-radius: 5px;

    box-shadow: 0px 0px 12px 5px ${brandColors.black}12;

    text-align: left;

    width: 100%;

    &:focus {
        border-bottom: 2px solid ${brandColors.black};
    }
`;

const TextArea = styled.textarea`
    all: unset;

    padding: 12px;
    font-size: 1rem;
    font-weight: 500;
    color: ${brandColors.black};
    background-color: ${brandColors.white};

    border-radius: 5px;

    box-shadow: 0px 0px 12px 5px ${brandColors.black}12;

    text-align: left;

    width: 100%;

    &:focus {
        border-bottom: 2px solid ${brandColors.black};
    }
`;

const ContactButton = styled.button`
    all: unset;
    cursor: pointer;
    color: ${brandColors.white};
    //     background-color: ${brandColors.purple};
    background: linear-gradient(90deg, ${brandColors.purple} 0%, ${brandColors.lighterPurple} 100%);

    padding: 10px 50px;
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

function Contact(props: Props) {
    const [message, setMessage] = React.useState("");

    return (
        <ContentContainerDiv>
            <div style={{ marginTop: "48px", textAlign: "center" }}>
                <Headline>Contact Us</Headline>
                <Caption style={{ marginTop: "12px" }}>
                    We offer you free consultations with a finance expert and consultant who will answer all your questions and assist you in the personal financial planning process.
                </Caption>
                <div style={{ maxWidth: "600px", margin: "48px auto 0 auto" }}>
                    <div style={{ display: "flex", gap: "24px" }}>
                        <TextFieldInput placeholder="Name..." />
                        <TextFieldInput placeholder="Email..." />
                    </div>
                    <div style={{ marginTop: "24px", display: "flex", gap: "24px" }}>
                        <TextArea placeholder="Message..." rows={8} value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>
                </div>

                <ContactButton
                    style={{ marginTop: "48px" }}
                    disabled={message.length === 0}
                    onClick={() => {
                        const subject = "Question about Bonokey";
                        const body = encodeURI(message);
                        const email = "help@bonokey.com";
                        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

                        return window.open(mailtoLink);
                    }}
                >
                    Contact
                </ContactButton>
            </div>
        </ContentContainerDiv>
    );
}

export default Contact;
