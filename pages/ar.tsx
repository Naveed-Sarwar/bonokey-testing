import React from "react";
import styles from "../styles/Ar.module.scss";
import Head from "next/head";
import HeaderAr from "../components/HeaderAr";
import FooterAr from "../components/FooterAr";
import BankAr, { Props as BankProps, BankType } from "../components/BankAr";
import Filters, { Filter } from "../controller/Filter";
import { GetServerSideProps } from "next";
import prisma from "../prisma/prisma";
import * as PrismaTypes from "@prisma/client";
import { AnalyticsBrowser } from "@segment/analytics-next";

const analytics = AnalyticsBrowser.load({ writeKey: "BBZmEer22jLupVHfv4fSX3lzGhQE9Lts" });

export const getServerSideProps: GetServerSideProps = async () => {
    const sectors = await prisma.sector.findMany();
    const salaryGroups = await prisma.salary.findMany();

    const banks = (await prisma.bank.findMany({ include: { aprValues: true, saleReps: true } })).map((bank) => {
        const bankProps: BankType = {} as BankType;
        bankProps.id = bank.id;
        bankProps.name = bank.nameAR;
        bankProps.logo = bank.logo;
        bankProps.mobile = bank.saleReps[0].mobile;
        bankProps.salaryTransfer = bank.salaryTransfer;
        bankProps.minLoan = bank.minLoan;
        bankProps.minSalary = bank.minSalary;
        bankProps.offer = bank.offer;
        bankProps.aprValues = bank.aprValues;
        return bankProps;
    });

    return {
        props: { sectors, salaryGroups, banks },
    };
};

type State = {
    loan: number;
    salary: number;
    salaryGroup: PrismaTypes.Salary;
    useMaxLoan: boolean;
    showSector: boolean;
    sector: PrismaTypes.Sector;
    duration: number;
    showFilter: boolean;
    filter: Filter;
    banksProps: BankProps[];
    errors: string[];
};

type Props = {
    sectors: PrismaTypes.Sector[];
    salaryGroups: PrismaTypes.Salary[];
    banks: BankType[];
};

const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
const a2e = (s) => s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

class Ar extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            loan: 100000,
            salary: 8500,
            salaryGroup: null,
            useMaxLoan: false,
            showSector: false,
            sector: props.sectors[0],
            duration: 5,
            showFilter: false,
            filter: Filters[0],
            banksProps: [],
            errors: [],
        };

        this.search = this.search.bind(this);
        this.getSalaryGroup = this.getSalaryGroup.bind(this);
    }

    componentDidMount() {
        analytics.track("Page Viewed", {
            category: "Arabic",
            label: "Home Page",
        });
        this.getSalaryGroup(this.state.salary).then((salaryGroup) => this.setState({ salaryGroup }));
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevState.filter?.name !== this.state.filter?.name) this.search(null);
    }

    async search(e) {
        e?.preventDefault();
        const { loan, salary, salaryGroup, useMaxLoan, sector, duration } = this.state;
        const { banks, salaryGroups } = this.props;

        await this.setState({ errors: [], banksProps: [] });

        banks.sort((a, b) => a.minLoan - b.minLoan);
        const minLoan = banks[0].minLoan;
        banks.sort((a, b) => a.minSalary - b.minSalary);
        salaryGroups.sort((a, b) => a.min - b.min);
        const minSalary = banks[0].minSalary < salaryGroups[0].min ? salaryGroups[0].min : banks[0].minSalary;
        const lowestApr = banks
            .map((bank) => bank.aprValues.find(({ bankId, salaryId, sectorId }) => bankId === bank.id && salaryId === salaryGroup?.id && sectorId === sector.id))
            .reduce((acc, cur) => (acc?.value < cur?.value ? acc : cur));
        const highestMaxLoan = (salary * (1 / 3) * (duration * 12)) / (1 + (lowestApr?.value / 100) * duration);

        if (loan < minLoan || salary < minSalary || (loan > highestMaxLoan && !useMaxLoan)) {
            const errors = [];

            if (loan > highestMaxLoan) alert(`عذرا, بناء على الراتب والمدة فان الحد الاعلى للتمويل هو ${highestMaxLoan.toFixed(0)}`);
            if (loan < minLoan && !useMaxLoan) alert(` عذرا ، الحد الأدنى لمبلغ التمويل الذي يمكننا العثور عليه هو ${minLoan}`);
            if (salary < minSalary) alert(`عذرا ، لم يتم العثور على أي بنك بالراتب الذي تم إدخاله`);

            if (loan < minLoan && useMaxLoan) {
            } else {
                this.setState({ errors });
                return;
            }
        }

        const banksProps: BankProps[] = banks
            .map((bank) => {
                const bankProps = {} as BankProps;
                bankProps.name = bank.name;
                bankProps.logo = bank.logo;
                bankProps.mobile = bank.mobile;
                bankProps.apr = bank.aprValues.find(({ bankId, salaryId, sectorId }) => bankId === bank.id && salaryId === salaryGroup?.id && sectorId === sector.id)?.value;
                bankProps.total = useMaxLoan ? salary * (1 / 3) * (duration * 12) : loan + loan * duration * (bankProps.apr / 100);
                bankProps.loan = useMaxLoan ? bankProps.total / (1 + (bankProps.apr / 100) * duration) : loan;
                bankProps.monthly = bankProps.total / (duration * 12);
                bankProps.fees = 0.01 * bankProps.total > 5000 ? 5000 : 0.01 * bankProps.total;
                bankProps.maxLoan = (salary * (1 / 3) * (duration * 12)) / (1 + (bankProps.apr / 100) * duration);
                bankProps.salaryTransfer = bank.salaryTransfer;
                bankProps.revenue = bankProps.total - bankProps.loan;
                bankProps.minLoan = bank.minLoan;
                bankProps.offer = bank.offer;
                bankProps.useMaxLoan = useMaxLoan;

                bankProps.loanDurationInYears = duration;
                bankProps.sector = sector.name;
                bankProps.userMonthlySalary = salary;
                if (!bankProps.apr || salary < bank.minSalary || (loan < bank.minLoan && !useMaxLoan) || bankProps.loan > bankProps.maxLoan) return null;
                return bankProps;
            })
            .filter((bank) => bank);

        this.setState({ banksProps });
    }

    async getSalaryGroup(salary: number) {
        const res = await fetch("/api/salary/get", {
            method: "POST",
            body: JSON.stringify({ salary }),
        }).then((res) => res.json());
        return res?.salary;
    }

    parseNumber(value: string) {
        value = a2e(value);
        value = p2e(value);
        return parseInt(value.replaceAll(",", "")) || 0;
    }

    formatNumber(value: number) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    render() {
        const { filter, banksProps } = this.state;

        const banks = [...banksProps].sort((a, b) => (filter?.sort ? filter.sort(a, b) : 0)).filter((bank) => (filter?.filter ? filter.filter(bank) : true));

        const sectors = this.props.sectors.map((sector, index) => (
            <li key={index} className={this.state.sector?.name === sector.nameAR ? styles.active : ""} onClick={() => this.setState({ sector, showSector: false })}>
                {sector.nameAR}
            </li>
        ));

        const filters = Filters.map((filter, index) => (
            <li key={index} className={this.state.filter?.nameAR === filter.nameAR ? styles.active : ""} onClick={() => this.setState({ filter, showFilter: false })}>
                {filter.nameAR}
            </li>
        ));

        return (
            <div className={styles.container}>
                <Head>
                    <title>بنوكي | افضل عروض التمويل الشخصي والعقاري</title>
                    <meta name="description" content="احصل على اقل نسبة ارباح للتمويل الشخصي او العقاري من جميع البنوك في السعودية" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <HeaderAr />

                <section className={styles.search}>
                    <div className={styles.wrapper}>
                        <h5 className={styles.mainTitle}>قارن بين أفضل عروض التمويل الشخصي</h5>
                        <h6 className={styles.subTitle}>أفضل النسب بين يديك في ثوانٍ</h6>

                        <form className={styles.form} onSubmit={this.search}>
                            <div className={styles.row}>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="loan">ابحث عن تمويل بقيمة</label>
                                    <input
                                        id="loan"
                                        type="text"
                                        disabled={this.state.useMaxLoan}
                                        value={this.formatNumber(this.state.loan) || "0"}
                                        onChange={(e) => {
                                            const loan = this.parseNumber(this.parseNumber(e.target.value) > 1000000 ? "1000000" : e.target.value);
                                            this.setState({ loan });
                                        }}
                                    />
                                    <span className={styles.currency}>ر.س</span>
                                </div>

                                <div className={styles.inputContainer}>
                                    <label htmlFor="salary">الدخل الشهري</label>
                                    <input
                                        id="salary"
                                        type="text"
                                        value={this.formatNumber(this.state.salary) || "0"}
                                        onChange={(e) => {
                                            const salary = this.parseNumber(this.parseNumber(e.target.value) > 90000 ? "90000" : e.target.value);
                                            this.getSalaryGroup(salary).then((salaryGroup) => this.setState({ salaryGroup }));
                                            this.setState({ salary });
                                        }}
                                    />
                                    <span className={styles.currency}>ر.س</span>
                                </div>

                                <div className={styles.checkBoxContainer}>
                                    <button type="button" id="useMaxLoan" onClick={() => this.setState({ useMaxLoan: !this.state.useMaxLoan })}>
                                        {this.state.useMaxLoan && (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    <label htmlFor="useMaxLoan">الحد الاعلى</label>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.selectContainer}>
                                    <label htmlFor="sector">اعمل في</label>

                                    <div className={styles.select} onClick={() => this.setState({ showSector: !this.state.showSector })}>
                                        <i className={styles.icon}>
                                            {this.state.showSector ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                    <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                    <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                                                </svg>
                                            )}
                                        </i>
                                        <input id="sector" type="text" readOnly value={this.state.sector?.nameAR} />
                                    </div>

                                    <ul className={styles.menu} style={this.state.showSector ? { display: "block" } : {}}>
                                        {sectors}
                                    </ul>
                                </div>

                                <div className={styles.sliderContainer}>
                                    <label htmlFor="duration">(لمدة (سنوات</label>
                                    <input id="duration" type="range" min={1} max={5} defaultValue={this.state.duration} onChange={(e) => this.setState({ duration: parseInt(e.target.value) })} />
                                    <span>
                                        <span>{this.state.duration}</span>
                                    </span>
                                </div>

                                <div className={styles.submitContainer}>
                                    <button type="submit">بحث</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                <section className={styles.bankList}>
                    <div className={styles.wrapper}>
                        <div className={styles.filter}>
                            <button onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                                <i className={styles.icon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M0 416c0-17.7 14.3-32 32-32l54.7 0c12.3-28.3 40.5-48 73.3-48s61 19.7 73.3 48L480 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-246.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 448c-17.7 0-32-14.3-32-32zm192 0c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zM384 256c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm-32-80c32.8 0 61 19.7 73.3 48l54.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-54.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l246.7 0c12.3-28.3 40.5-48 73.3-48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32zm73.3 0L480 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-214.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 128C14.3 128 0 113.7 0 96S14.3 64 32 64l86.7 0C131 35.7 159.2 16 192 16s61 19.7 73.3 48z" />
                                    </svg>
                                </i>
                                تصفية حسب
                            </button>

                            {this.state.showFilter && <ul className={styles.menu}>{filters}</ul>}
                        </div>

                        <p className={styles.error}>
                            {this.state.errors.map((error, index) => (
                                <span key={index}>{error}</span>
                            ))}
                        </p>

                        {banks.map((bank, index) => (
                            <BankAr
                                key={index}
                                name={bank.name}
                                logo={bank.logo}
                                mobile={bank.mobile}
                                apr={bank.apr}
                                loan={bank.loan}
                                monthly={bank.monthly}
                                total={bank.total}
                                fees={bank.fees}
                                maxLoan={bank.maxLoan}
                                salaryTransfer={bank.salaryTransfer}
                                revenue={bank.revenue}
                                minLoan={bank.minLoan}
                                offer={bank.offer}
                                useMaxLoan={bank.useMaxLoan}
                                loanDurationInYears={bank.loanDurationInYears}
                                sector={bank.sector}
                                userMonthlySalary={bank.userMonthlySalary}
                            />
                        ))}
                    </div>
                </section>

                <FooterAr />
            </div>
        );
    }
}

export default Ar;
