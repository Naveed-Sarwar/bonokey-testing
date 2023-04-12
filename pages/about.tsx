import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.scss";

class About extends React.Component<any, any> {
    render() {
        return (
            <div>
                {/* <Header /> */}
                <Head>
                    <title>Bonokey | Home</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <section className={styles.search}>
                    <div className={styles.wrapper}>
                        <h5 className={styles.mainTitle}>
                            تواصل معنا
                            <br />
                            Contact Us
                        </h5>
                        <h2 className={styles.subTitl}>
                            اذا كان لديك اي استفسار يمكنك التواصل معنا
                            <br />
                            If you have any question, please contact us
                        </h2>

                        <button className={styles.submitContainer} onClick={() => window.open(`mailto: care@bonokey.com`)}>
                            Contact Us تواصل معنا
                        </button>
                    </div>
                </section>

                {/* <Footer /> */}
            </div>
        );
    }
}

export default About;
