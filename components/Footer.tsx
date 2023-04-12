import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Footer.module.scss";

type State = {};

type Props = {};

class Footer extends React.Component<Props, State> {
  render() {
    return (
      <footer className={styles.footer}>
        <Link href="/">
          <a className={styles.logo}>
            <Image src="/img/logo.png" alt="" width={240} height={67} />
          </a>
        </Link>

        <ul className={styles.list}>
          <li>
            <Link href="/ar">
              <a>AR</a>
            </Link>
          </li>
          <li>
              <Link href="/">
                <a>Personal Loan</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Mortgage</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Enterprises</a>
              </Link>
            </li>
          <li>
            <Link href="http://blog.bonokey.com/">
              <a>Blog</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>

        <p className={styles.mainDescription} />

        <p className={styles.mainDescription}>care@bonokey.com</p>
        <p className={styles.subDescription}>Bonokey | All rights reserved</p>
      </footer>
    );
  }
}

export default Footer;
