import { brandColors, uiBreakpoint, urlPaths } from "../../utils/helpers";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import Logo from "../../img/Logo.png";

import { Link as ReactScrollLink, scroller as reactScroll } from "react-scroll";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
type Props = {};

const NavBarDiv = styled.div`
  width: 100%;
  background-color: ${brandColors.white};
  position: sticky;
  top: 0;
  z-index: 999;

  box-shadow: 0px 0px 12px 5px ${brandColors.black}08;
`;

const ContentContainerDiv = styled.div`
  max-width: 1100px;
  margin: 0 auto;

  padding: 12px 12px;
`;

const LogoImg = styled.img`
  height: 50px;
  margin-left: 160px;

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    margin-left: 0px;
    }
`;

const MyLink = styled(ReactScrollLink)`
  cursor: pointer;
  color: ${brandColors.black};
  font-size: 1em;
  font-weight: 400;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &.active {
    font-weight: 600;
    text-decoration: underline;
  }

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    display: none;
  }
`;

const NavbarA = styled.a`
  cursor: pointer;
  color: ${brandColors.black};
  font-size: 1em;
  font-weight: 400;
  text-decoration: none;
  padding: 0px 10px;
  &:hover {
    text-decoration: underline;
  }

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    display: none;
  }
`;

const LanguageText = styled.p`
  cursor: pointer;

  font-size: 1rem;
  font-weight: 400;
  color: ${brandColors.black};

  &:hover {
    text-decoration: underline;
  }
  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    display: none;
  }
`;

const DropdownDiv = styled.div`
  position: absolute;
  margin-top: 12px;
  padding: 24px;
  background-color: ${brandColors.white};
  border-radius: 5px;

  box-shadow: 0px 0px 12px 5px ${brandColors.black}08;

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    display: none;
  }
`;

const DropdownItemDiv = styled.div`
  padding: 6px 0;
`;

// SIDEBAR

const HamburgerDiv = styled.div`
  display: none;

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const SideBarAside = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: ${brandColors.white};
  top: ${(props) => (props.isOpen ? "0" : "-100%")};
  opacity: ${(props) => (props.isOpen ? "100%" : "0")};
  transition: 0.3s ease-in-out;
`;

const CloseIcon = styled(FaTimes)`
  cursor: pointer;
  margin-left: 12px;
  margin-top: 24px;
  font-size: 2rem;
  color: ${brandColors.black};
`;

const MySidebarLink = styled(ReactScrollLink)`
  cursor: pointer;
  color: ${brandColors.black};
  font-size: 1em;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &.active {
    font-weight: 600;
    text-decoration: underline;
  }
`;

const SidebarA = styled.a`
  cursor: pointer;
  color: ${brandColors.black};
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }

  /* PHONE UI
    @media only screen and (max-width: ${uiBreakpoint}px) {
        display: none;
    } */
`;

const SidebarDropdownDiv = styled.div`
  margin-top: 12px;
  padding: 24px;

  background-color: ${brandColors.captionBlack};
`;

const BetaDiv = styled.div`
  position: fixed;
  top: 0;
  right: -120px;
  padding: 24px;
  background-color: ${brandColors.blue};
  width: 400px;
  text-align: center;

  color: ${brandColors.white};
  font-size: 1rem;
  font-weight: 500;

  transform: rotate(30deg);

  z-index: 9999;

  /* PHONE UI */
  @media only screen and (max-width: ${uiBreakpoint}px) {
    transform: scale(0.6) rotate(30deg);
    right: -150px;
  }
`;

function NewNavbar(props: Props) {
  const router = useRouter();
  const isHomeScreen = router.pathname === "/" ? true : false;

  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showSidebarDropdown, setShowSidebarDropdown] = React.useState(false);

  const [openSidebar, setOpenSidebar] = React.useState(false);

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "ar", label: "Arabic" },
  ];
  const { t, i18n } = useTranslation();
  const [english, setEnglish] = React.useState(false);
  const [dropDownValue, setDropDownValue] = React.useState("en");

  const setLanguage = (code) => {
    return i18n.changeLanguage(code);
  };
  return (
    <>
      {/* <div style={{ textAlign: "center", color: brandColors.white, backgroundColor: brandColors.blue, padding: "6px", fontSize: "1rem", fontWeight: "500" }}>* BETA *</div> */}
      <BetaDiv>BETA</BetaDiv>
      <NavBarDiv>
        <ContentContainerDiv>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <Link href={urlPaths.home} passHref>
                                <LogoImg src={Logo.src} />
                            </Link> */}
              <HamburgerDiv style={{ marginLeft: "20px" }}>
                <FaBars
                  onClick={() => setOpenSidebar(true)}
                  color={brandColors.black}
                  size={24}
                />
              </HamburgerDiv>

              <div
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {english ? (
                  <LanguageText
                    onClick={() => [
                      setLanguage(LANGUAGES[1].code),
                      setDropDownValue("ar"),
                      setEnglish(false),
                    ]}
                  >
                    Ar
                  </LanguageText>
                ) : (
                  <LanguageText
                    onClick={() => [
                      setLanguage(LANGUAGES[0].code),
                      setDropDownValue("en"),
                      setEnglish(true),
                    ]}
                  >
                    En
                  </LanguageText>
                )}
                {/* <div>
                                    <MyLink to="test" offset={-100} smooth={true} duration={1000} style={{ marginLeft: "24px" }} onMouseEnter={() => setShowDropdown(true)}>
                                        Financing
                                        <FaChevronDown size={12} color={brandColors.black + "95"} style={{ marginLeft: "6px" }} />
                                    </MyLink>
                                    {showDropdown && (
                                        <DropdownDiv onMouseLeave={() => setShowDropdown(false)}>
                                            <DropdownItemDiv>
                                                <MyLink to="test" offset={-100} smooth={true} duration={1000}>
                                                    Personal
                                                </MyLink>
                                            </DropdownItemDiv>
                                            <DropdownItemDiv>
                                                <MyLink to="test" offset={-100} smooth={true} duration={1000}>
                                                    Re-financing
                                                </MyLink>
                                            </DropdownItemDiv>
                                            <DropdownItemDiv>
                                                <MyLink to="test" offset={-100} smooth={true} duration={1000}>
                                                    Dept purchase
                                                </MyLink>
                                            </DropdownItemDiv>
                                            <DropdownItemDiv>
                                                <MyLink to="test" offset={-100} smooth={true} duration={1000}>
                                                    Car
                                                </MyLink>
                                            </DropdownItemDiv>
                                            <DropdownItemDiv>
                                                <MyLink to="test" offset={-100} smooth={true} duration={1000}>
                                                    Mortgage
                                                </MyLink>
                                            </DropdownItemDiv>
                                        </DropdownDiv>
                                    )}
                                </div> */}
                <MyLink
                  to="test"
                  offset={-100}
                  smooth={true}
                  duration={1000}
                  style={{ marginLeft: "20px" }}
                >
                  تواصل معنا
                </MyLink>
                {isHomeScreen ? (
                  <MyLink
                    to="offer-section"
                    offset={-100}
                    smooth={true}
                    duration={1000}
                    style={{ marginLeft: "20px" }}
                  >
                    المدونة{" "}
                  </MyLink>
                ) : (
                  <Link href={urlPaths.home + "#offer-section"} passHref>
                    <NavbarA style={{ padding: "0px 20px" }}> المدونة </NavbarA>
                  </Link>
                )}
                <Link href="http://blog.bonokey.com" passHref>
                  <NavbarA style={{ padding: "0px 20px" }}> العروض </NavbarA>
                </Link>
                <Link href={urlPaths.contact} passHref>
                  <NavbarA style={{ padding: "0px 20px" }}> الودائع </NavbarA>
                </Link>
                <div>
                  <MyLink
                    to="test"
                    offset={-100}
                    smooth={true}
                    duration={1000}
                    style={{ marginLeft: "20px" }}
                    onMouseEnter={() => setShowDropdown(true)}
                  >
                    التمويل
                    <FaChevronDown
                      size={12}
                      color={brandColors.black + "95"}
                      style={{ marginLeft: "6px" }}
                    />
                  </MyLink>
                  {showDropdown && (
                    <DropdownDiv onMouseLeave={() => setShowDropdown(false)}>
                      <DropdownItemDiv>
                        <MyLink
                          to="test"
                          offset={-100}
                          smooth={true}
                          duration={1000}
                        >
                          {t("index:personal")}
                        </MyLink>
                      </DropdownItemDiv>
                      <DropdownItemDiv>
                        <MyLink
                          to="test"
                          offset={-100}
                          smooth={true}
                          duration={1000}
                        >
                          {t("index:reFinancing")}
                        </MyLink>
                      </DropdownItemDiv>
                      <DropdownItemDiv>
                        <MyLink
                          to="test"
                          offset={-100}
                          smooth={true}
                          duration={1000}
                        >
                          {t("index:deptPurchase")}
                        </MyLink>
                      </DropdownItemDiv>
                      <DropdownItemDiv>
                        <MyLink
                          to="test"
                          offset={-100}
                          smooth={true}
                          duration={1000}
                        >
                          {t("index:car")}
                        </MyLink>
                      </DropdownItemDiv>
                      <DropdownItemDiv>
                        <MyLink
                          to="test"
                          offset={-100}
                          smooth={true}
                          duration={1000}
                        >
                          {t("index:mortage")}
                        </MyLink>
                      </DropdownItemDiv>
                    </DropdownDiv>
                  )}
                </div>
                <Link href={urlPaths.home} passHref>
                  <NavbarA style={{ padding: "0px 20px" }}>الرئيسية </NavbarA>
                </Link>{" "}
                {/* <Link href={router.pathname.endsWith("ar") ? urlPaths.home : urlPaths.home + "/ar"} passHref>
                                    <NavbarA style={{ marginLeft: "24px" }}>{router.pathname.endsWith("ar") ? "EN" : "AR"}</NavbarA>
                                </Link> */}
                <Link href={urlPaths.home} passHref>
                  <LogoImg src={Logo.src} />
                </Link>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {/* <Link href={urlPaths.home + "/ar"} passHref>
                                <NavbarA>AR</NavbarA>
                            </Link> */}
            </div>
          </div>
        </ContentContainerDiv>
      </NavBarDiv>
      {/* <BetaDiv>BETA</BetaDiv> */}
      <SideBarAside isOpen={openSidebar}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <CloseIcon onClick={() => setOpenSidebar(false)} />

          <div></div>
        </div>
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <div>
            <Link href={urlPaths.home} passHref>
              <SidebarA
                style={{ marginLeft: "24px" }}
                onClick={() => setOpenSidebar(false)}
              >
                Home
              </SidebarA>
            </Link>
          </div>
          <div style={{ marginTop: "48px" }}>
            <MySidebarLink
              to="test"
              offset={-100}
              smooth={true}
              duration={1000}
              onClick={() => setShowSidebarDropdown(!showSidebarDropdown)}
            >
              Financing
              <FaChevronDown
                size={15}
                color={brandColors.black + "95"}
                style={{ marginLeft: "12px" }}
              />
            </MySidebarLink>
            {showSidebarDropdown && (
              <SidebarDropdownDiv>
                <div style={{ padding: "24px 0" }}>
                  <MySidebarLink
                    to="test"
                    offset={-100}
                    smooth={true}
                    duration={1000}
                    style={{ color: brandColors.white }}
                    onClick={() => setOpenSidebar(false)}
                  >
                    Personal
                  </MySidebarLink>
                </div>
                <div style={{ padding: "24px 0" }}>
                  <MySidebarLink
                    to="test"
                    offset={-100}
                    smooth={true}
                    duration={1000}
                    style={{ color: brandColors.white }}
                    onClick={() => setOpenSidebar(false)}
                  >
                    Re-financing
                  </MySidebarLink>
                </div>
                <div style={{ padding: "24px 0" }}>
                  <MySidebarLink
                    to="test"
                    offset={-100}
                    smooth={true}
                    duration={1000}
                    style={{ color: brandColors.white }}
                    onClick={() => setOpenSidebar(false)}
                  >
                    Dept purchase
                  </MySidebarLink>
                </div>
                <div style={{ padding: "24px 0" }}>
                  <MySidebarLink
                    to="test"
                    offset={-100}
                    smooth={true}
                    duration={1000}
                    style={{ color: brandColors.white }}
                    onClick={() => setOpenSidebar(false)}
                  >
                    Car
                  </MySidebarLink>
                </div>
                <div style={{ padding: "24px 0" }}>
                  <MySidebarLink
                    to="test"
                    offset={-100}
                    smooth={true}
                    duration={1000}
                    style={{ color: brandColors.white }}
                    onClick={() => setOpenSidebar(false)}
                  >
                    Mortgage
                  </MySidebarLink>
                </div>
              </SidebarDropdownDiv>
            )}
          </div>
          <div style={{ marginTop: "48px" }}>
            <MySidebarLink
              to="test"
              offset={-100}
              smooth={true}
              duration={1000}
              onClick={() => setOpenSidebar(false)}
            >
              Deposit
            </MySidebarLink>
          </div>
          <div style={{ marginTop: "48px" }}>
            {isHomeScreen ? (
              <MySidebarLink
                to="offer-section"
                offset={-100}
                smooth={true}
                duration={1000}
                onClick={() => setOpenSidebar(false)}
              >
                Offers
              </MySidebarLink>
            ) : (
              <Link href={urlPaths.home + "#offer-section"} passHref>
                <SidebarA
                  style={{ marginLeft: "24px" }}
                  onClick={() => setOpenSidebar(false)}
                >
                  Offers
                </SidebarA>
              </Link>
            )}
          </div>
          <div style={{ marginTop: "48px" }}>
            <Link href="http://blog.bonokey.com" passHref>
              <SidebarA
                style={{ marginLeft: "24px" }}
                onClick={() => setOpenSidebar(false)}
              >
                Blog
              </SidebarA>
            </Link>
          </div>
          <div style={{ marginTop: "48px" }}>
            <Link href={urlPaths.contact} passHref>
              <SidebarA
                style={{ marginLeft: "24px" }}
                onClick={() => setOpenSidebar(false)}
              >
                Contact Us
              </SidebarA>
            </Link>
          </div>
          <div style={{ marginTop: "48px" }}>
            <Link
              href={
                router.pathname.endsWith("ar")
                  ? urlPaths.home
                  : urlPaths.home + "/ar"
              }
              passHref
            >
              <SidebarA
                style={{ marginLeft: "24px" }}
                onClick={() => setOpenSidebar(false)}
              >
                {router.pathname.endsWith("ar") ? "EN" : "AR"}
              </SidebarA>
            </Link>
          </div>
        </div>
      </SideBarAside>
    </>
  );
}

export default NewNavbar;
