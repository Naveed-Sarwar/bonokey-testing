import React, { useEffect } from "react";
import Contact from "../components/newHome/Contact";
import Footer from "../components/newHome/Footer";
import Hero from "../components/newHome/Hero";
import NavBar from "../components/newHome/NavBar";
import Offers from "../components/newHome/Offers";
import SearchBar from "../components/newHome/SearchBar";
import WhyUs from "../components/newHome/WhyUs";
import Head from "next/head";
import styled from "styled-components";
import { brandColors } from "../utils/helpers";
import NewHero from "../components/new/newHero";
import "../languages/IMLocalize";
import NewWhyUs from "../components/new/newWhyUs";
import NewOffers from "../components/new/NewOffer";
import NewContact from "../components/new/NewContact";
import NewSearchBar from "../components/new/NewSearchBar";
import { useTranslation } from "react-i18next";
import Bank from "../components/Bank";
import prisma from "../prisma/prisma";
const SearchBarDiv = styled.div`
  background: linear-gradient(
    180deg,
    ${brandColors.transparent} 50%,
    ${brandColors.captionBlack}12 50%
  );
`;




function Home() {

  const { t, i18n } = useTranslation();

  const language = i18n.language;

  return (
    <>
      <Head>
        <title>Bonokey - Best loan offer comparisons</title>
        <meta
          name="description"
          content="Looking for the best loan offer? Bonokey makes it easy by allowing you to compare loan offers from different banks. Our platform offers a hassle-free way to find the loan that meets your financial needs. Start comparing today and find the best loan offer for you!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <NewHero /> */}
       <Hero />
       <SearchBar
            isOnHomePage={true}
            searchFunction={null}
            monthlySalary={0}
            loanAmount={0}
            jobSector={""}
            duration={0}
            useMaxLoan={false}
          />
      {/* <SearchBarDiv>
        {language == "en" ? (
          <SearchBar
            isOnHomePage={true}
            searchFunction={null}
            monthlySalary={0}
            loanAmount={0}
            jobSector={""}
            duration={0}
            useMaxLoan={false}
          />
        ) : (
          <NewSearchBar
            isOnHomePage={true}
            searchFunction={null}
            monthlySalary={0}
            loanAmount={0}
            jobSector={""}
            duration={0}
            useMaxLoan={false}
          />
        )}
      </SearchBarDiv> */}
      {/* <NewWhyUs /> */}
      <WhyUs />
      {/* <NewOffers /> */}
      <Offers />
      {/* <NewContact /> */}
      
      <Contact />
    </>
  );
}

export default Home;
