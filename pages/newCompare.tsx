import { Sector } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaFilter, FaSlidersH } from "react-icons/fa";
import styled from "styled-components";
import BankCard, { BankType, BankProps } from "../components/newHome/BankCard";
import BankCardOldDesign from "../components/newHome/BankCardOldDesign";
import Contact from "../components/newHome/Contact";
import SearchBar from "../components/newHome/SearchBar";
import BanksSkeletons from "../components/newHome/skeletons/BanksSkeletons";
import prisma from "../prisma/prisma";
import { brandColors, uiBreakpoint } from "../utils/helpers";
import { useTranslation } from "react-i18next";
import NewSearchBar from "../components/new/NewSearchBar";
import NewBankCardOldDesign from "../components/new/NewBankCardOldDesign";

type Props = {
  banksArray: BankType[];
  jobSectors: Sector[];
};

const ContentContainerDiv = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 12px;
`;

const BanksBackgroundDiv = styled.div`
  padding: 0 12px;
  background-color: ${brandColors.captionBlack}12;

  z-index: 998;
  position: relative;
`;

const InfoDiv = styled.div`
  text-align: center;
`;

const InfoHeadline = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${brandColors.black};
`;

const InfoCaption = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${brandColors.captionBlack};
`;

const FilterSelect = styled.select`
  all: unset;
  cursor: pointer;

  font-size: 1rem;
  /* font-weight: 500; */
  color: ${brandColors.black};

  font-family: "Inter", "Font Awesome 5 Free";
  font-weight: 600;
`;

const SearchBarDiv = styled.div`
  background: linear-gradient(
    180deg,
    ${brandColors.transparent} 50%,
    ${brandColors.captionBlack}12 50%
  );
`;

export async function getServerSideProps() {
  try {
    const jobSectors = await prisma.sector.findMany();
    const banks = await prisma.bank.findMany({
      include: { aprValues: true, saleReps: true },
    });
    const processedBanks: BankType[] = banks.map((bank) => {
      return {
        id: bank.id,
        name: bank.name,
        logo: bank.logo,
        mobile: bank.saleReps[0].mobile,
        salaryTransfer: bank.salaryTransfer,
        minSalary: bank.minSalary,
        minLoan: bank.minLoan,
        offer: bank.offer,
        aprValues: bank.aprValues,
      };
    });

    const props: Props = { banksArray: processedBanks, jobSectors: jobSectors };
    return { props: props };
  } catch (error) {
    console.log(
      "Something went wrong getting banks in getServerSideProps: " + error
    );
    const props: Props = { banksArray: null, jobSectors: null };
    return { props: props };
  }
}

async function getSalaryGroup(salary: number) {
  const res = await fetch("/api/salary/get", {
    method: "POST",
    body: JSON.stringify({ salary }),
  }).then((res) => res.json());
  return res?.salary;
}

function Compare(props: Props) {
  const router = useRouter();
  const { monthlySalary, loanAmount, jobSector, duration, useMaxLoan } =
    router.query;

  const [allProcessedBanksArray, setAllProcessedBanksArray] = useState<
    BankProps[]
  >([]);
  const [filteredProcessedBanksArray, setFilteredProcessedBanksArray] =
    useState<BankProps[]>([]);
  const [errorString, setErrorString] = useState<string>(null);

  const [filter, setFilter] = useState<string>("all");

  const [phoneNumberVerified, setPhoneNumberVerified] = React.useState(false);

  const selectRef = useRef();

  async function search(
    processedMonthlySalary: number,
    processedLoanAmount: number,
    processedJobSector: string,
    processedDuration: number,
    processedUseMaxLoan: boolean
  ) {
    setErrorString(null);

    const sector = props.jobSectors &&  props.jobSectors.find(
      (obj) => obj.name === processedJobSector
    );
    console.log("props",props.banksArray)
    console.log("jobs" , props.jobSectors)

    const minLoan =  Math.min(...props.banksArray.map((bank) => bank.minLoan));
    const minSalary = Math.min(
      ...props.banksArray.map((bank) => bank.minSalary)
    );
    const lowestApr = Math.min(
      ...props.banksArray.map((bank) =>
        Math.min(...bank.aprValues.map((aprValue) => aprValue.value))
      )
    );

    const maximumLoan =
      (processedMonthlySalary * (1 / 3) * (Number(processedDuration) * 12)) /
      (1 + (lowestApr / 100) * Number(processedDuration));

    const salaryGroup = await getSalaryGroup(processedMonthlySalary);

    // Check for errors
    if (processedLoanAmount > maximumLoan && !processedUseMaxLoan)
      setErrorString(
        `Sorry, based on your salary and term the maximum loan you can get is ${maximumLoan.toLocaleString(
          undefined
        )} SAR. Try a different search.`
      );
    if (processedLoanAmount < minLoan && !processedUseMaxLoan)
      setErrorString(
        `Sorry, the minimum loan amount we could find is ${minLoan.toLocaleString(
          undefined
        )} SAR. Try a different search.`
      );
    if (processedMonthlySalary < minSalary)
      setErrorString(
        "Sorry, we didn't find any bank with this salary. Try a different search."
      );

    const banksProps: BankProps[] = props.banksArray.map((bank) => {
      const bankProps = {} as BankProps;
      bankProps.name = bank.name;
      bankProps.logo = bank.logo;
      bankProps.mobile = bank.mobile;
      bankProps.apr = bank.aprValues.find(
        ({ bankId, salaryId, sectorId }) =>
          bankId === bank.id &&
          salaryId === salaryGroup?.id &&
          sectorId === sector.id
      )?.value;
      bankProps.total = processedUseMaxLoan
        ? processedMonthlySalary * (1 / 3) * (processedDuration * 12)
        : processedLoanAmount +
          processedLoanAmount * processedDuration * (bankProps.apr / 100);
      bankProps.loan = processedUseMaxLoan
        ? bankProps.total / (1 + (bankProps.apr / 100) * processedDuration)
        : processedLoanAmount;
      bankProps.monthly = bankProps.total / (processedDuration * 12);
      bankProps.fees =
        0.01 * bankProps.total > 5000 ? 5000 : 0.01 * bankProps.total;
      bankProps.maxLoan =
        (processedMonthlySalary * (1 / 3) * (Number(processedDuration) * 12)) /
        (1 + (bankProps.apr / 100) * Number(processedDuration));
      bankProps.salaryTransfer = bank.salaryTransfer;
      bankProps.revenue = bankProps.total - bankProps.loan;
      bankProps.minLoan = bank.minLoan;
      bankProps.offer = bank.offer;
      bankProps.useMaxLoan = processedUseMaxLoan;

      bankProps.loanDurationInYears = processedDuration;
      bankProps.sector = sector.name;
      bankProps.userMonthlySalary = processedMonthlySalary;

      if (
        !bankProps.apr ||
        processedMonthlySalary < bank.minSalary ||
        (processedLoanAmount < bank.minLoan && !processedUseMaxLoan) ||
        bankProps.loan > bankProps.maxLoan
      )
        return null;

      return bankProps;
    });

    // Filter and sort banks
    const filteredBanks = banksProps.filter((bank, index) => bank);
    filteredBanks.sort((a, b) => a.apr - b.apr);

    setAllProcessedBanksArray(filteredBanks);
    setFilteredProcessedBanksArray(filteredBanks);
  }

  function filterBanks(filter: string) {
    const filteredBanks =
      filter === "all"
        ? allProcessedBanksArray.filter((bank, index) => bank)
        : filter === "offers"
        ? allProcessedBanksArray.filter((bank, index) => bank.offer)
        : filter === "no-salary-transfer"
        ? allProcessedBanksArray.filter((bank, index) => !bank.salaryTransfer)
        : null;
    filteredBanks.sort((a, b) => a.apr - b.apr);

    setFilteredProcessedBanksArray(filteredBanks);
  }

  const shouldSearch =
    Number(monthlySalary) &&
    Number(loanAmount) &&
    (jobSector as string) &&
    Number(duration) &&
    useMaxLoan;

  useEffect(() => {
    // Filter banks based on search parameters
    if (shouldSearch) {
      search(
        Number(monthlySalary),
        Number(loanAmount),
        jobSector as string,
        Number(duration),
        useMaxLoan === "true"
      );
    }
  }, [router.query]);

  const isLoading = shouldSearch
    ? filteredProcessedBanksArray.length === 0 && !errorString
    : false;
   
  return (
    <div>
      <SearchBarDiv style={{ marginTop: "48px" }}>

      <NewSearchBar
          isOnHomePage={false}
          searchFunction={search}
          monthlySalary={Number(monthlySalary)}
          loanAmount={Number(loanAmount)}
          jobSector={jobSector as string}
          duration={Number(duration)}
          useMaxLoan={useMaxLoan === "true" ? true : false}
        /> 
      </SearchBarDiv>

      <BanksBackgroundDiv>
        <ContentContainerDiv
          style={{ paddingTop: "96px", paddingBottom: "96px" }}
        >
          {isLoading ? (
            <BanksSkeletons />
          ) : filteredProcessedBanksArray.length > 0 && !errorString ? (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-start" , textAlign: "left" }}>
                <div></div>
                <div
                  style={{
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "flex-start",
                    // float: "left",
                    // gap: "6px",
                    alignItems: "left",
                    marginLeft: "-30px",
                  }}
                >
                  <FilterSelect
                    ref={selectRef}
                    onChange={(event) => {
                      const value = event.target.value;
                      filterBanks(value);
                    }}
                    defaultValue={filter}
                    style={{ textAlign: "right" }}
                  >
                    <option key={0} value="all">
                    تصفية حسب &#xf1de;
                    </option>
                    <option key={1} value="offers">
                    عروض &#xf1de;
                    </option>
                    <option key={2} value="no-salary-transfer">
                    بدون تحويل الراتب &#xf1de;
                    </option>
                  </FilterSelect>
                  {/* <FaSlidersH color={brandColors.black} size={18} /> */}
                </div>
              </div>
              {filteredProcessedBanksArray.map((bank, index) => {
                return (
                  <div
                    style={{ marginTop: index > 0 ? "48px" : "0px" }}
                    key={index}
                  >
                    {/* <BankCard index={index} bank={bank} phoneNumberVerified={phoneNumberVerified} setPhoneNumberVerified={setPhoneNumberVerified} /> */}
                    <NewBankCardOldDesign
                      index={index}
                      bank={bank}
                      phoneNumberVerified={phoneNumberVerified}
                      setPhoneNumberVerified={setPhoneNumberVerified}
                    />
                  </div>
                );
              })}
            </div>
          ) : errorString ? (
            <InfoDiv style={{ marginTop: "48px" }}>
              <InfoHeadline>Oops...</InfoHeadline>
              <InfoCaption>{errorString}</InfoCaption>
            </InfoDiv>
          ) : (
            <InfoDiv style={{ marginTop: "48px" }}>
              <InfoHeadline>Oops...</InfoHeadline>
              <InfoCaption>
              لا توجد بنوك مطابقة لمدخلاتك. جرب بحثًا مختلفًا
                 {/* No banks matched your inputs. Try a different search. */}
              </InfoCaption>
            </InfoDiv>
          )}
        </ContentContainerDiv>
      </BanksBackgroundDiv>

      <div style={{ marginTop: "200px" }}>
        <Contact />
      </div>
    </div>
  );
}

export default Compare;
