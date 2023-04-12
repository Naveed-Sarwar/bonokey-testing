import { AppProps } from "next/app";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "../components/newHome/Footer";
import NavBar from "../components/newHome/NavBar";
import "../styles/globals.css";

import AOS from "aos";
import "aos/dist/aos.css";
import styled from "styled-components";
import NewNavbar from "../components/new/NewNavbar";
import NewFooter from "../components/new/NewFooter";

const CaptchaDiv = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Init AOS for animations
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    // The Grid is needed so the footer is always at the bottom of the page (Event when there is not enough content to fill the page)
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <CaptchaDiv>
        <div id="recaptcha-container"></div>
      </CaptchaDiv>

      <main>
        <Component style={{ flex: "1" }} {...pageProps} />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            error: {
              duration: 7000, // Display error toast for 7 sec
            },
          }}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
