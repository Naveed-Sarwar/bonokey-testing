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
        <NewBankCardOldDesign index={0} bank={{
          name: "",
          logo: "",
          mobile: "",
          apr: 0,
          loan: 0,
          monthly: 0,
          total: 0,
          fees: 0,
          maxLoan: 0,
          salaryTransfer: false,
          revenue: 0,
          minLoan: 0,
          offer: false,
          useMaxLoan: false,
          loanDurationInYears: 0,
          sector: "",
          userMonthlySalary: 0
        }} phoneNumberVerified={false} setPhoneNumberVerified={function (value: React.SetStateAction<boolean>): void {
          throw new Error("Function not implemented.");
        } } />
      </div>
    );
  }
}

export default Home;
