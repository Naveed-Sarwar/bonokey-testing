import { brandColors, urlPaths } from "../../utils/helpers";
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "react-i18next";

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

  background: linear-gradient(
    90deg,
    ${brandColors.purple} 0%,
    ${brandColors.lighterPurple} 100%
  );
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

function NewContact(props: Props) {
  const { t } = useTranslation();

  return (
    <ContentContainerDiv>
      <ContactDiv data-aos="fade-up">
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <Headline id="contact-section" style={{ marginBottom: "12px" }}>
            عندك سؤال؟
          </Headline>
          <Caption>
            نقدم لك استشارات مجانية مع خبير مالي واستشاري يجيب على جميع أسئلتك
            ويساعدك في عملية التخطيط المالي الشخصي.
          </Caption>

          <Link href={urlPaths.contact} passHref>
            <ContactButton style={{ marginTop: "24px" }}>
            تواصل معنا
            </ContactButton>
          </Link>
        </div>
      </ContactDiv>
    </ContentContainerDiv>
  );
}

export default NewContact;
