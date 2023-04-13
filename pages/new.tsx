import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.scss";
import NewNavbar from "../components/new/NewNavbar";
import NewHero from "../components/new/newHero";
import NewSearchBar from "../components/new/NewSearchBar";
import NewFooter from "../components/new/NewFooter";
import NewContact from "../components/new/NewContact";
import NewWhyUs from "../components/new/newWhyUs";
import "../languages/IMLocalize";
import NewBankCardOldDesign from "../components/new/NewBankCardOldDesign";
import Bank from "../components/Bank";

class Home extends React.Component<any, any> {
  render() {
    return (
      <div>
        <NewNavbar />
        <NewHero />
        <NewSearchBar
          isOnHomePage={true}
          searchFunction={null}
          monthlySalary={0}
          loanAmount={0}
          jobSector={""}
          duration={0}
          useMaxLoan={false}
        />
        <NewWhyUs />
        <NewContact />
        <NewFooter />

      </div>
    );
  }
}

export default Home;
