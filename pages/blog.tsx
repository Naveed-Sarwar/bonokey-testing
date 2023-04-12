import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Blog extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Head>
          <title>Bonokey | Blog</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* <Header /> */}
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Blog;
