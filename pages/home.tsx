import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.scss";


class Home extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Head>
          <title>Bonokey | Blog</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* <Header /> */}

        <main>
      <h1 >
          Welcome to <a href="https://nextjs.org/docs">Bonokey</a>
        </h1>
       
        <h2>
          Compare best loan, credit card, and deposite from Saudi banks
        </h2>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Personal Loan &rarr;</h3>
            <p>Find best APR% among all saudi banks in one click!</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Home Loan &rarr;</h3>
            <p>Purchase your home with the lowest APR%</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Credit Card & Visa &rarr;</h3>
            <p>Compare all credit cards and visa and get the most suite your needs!</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deposit &rarr;</h3>
            <p>
              Want to invest your cash, find the best deposit rare!
            </p>
          </a>
        </div>
      </main>


        {/* <Footer /> */}
      </div>
    );
  }
}

export default Home;
