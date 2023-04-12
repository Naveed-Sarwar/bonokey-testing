import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/FooterAr.module.scss";

type State = {};

type Props = {};

class FooterAr extends React.Component<Props, State> {
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
            <Link href="/">
              <a>EN</a>
            </Link>
          </li>
          <li>
           <Link href="/ar">
                <a>التمويل العقاري</a>
              </Link>
            </li>
            <li>
           <Link href="/ar">
                <a>الشركات</a>
              </Link>
            </li>
          <li>
            <Link href="http://blog.bonokey.com/">
              <a>المدونة</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>نبذه عنا</a>
            </Link>
          </li>
        </ul>

        <p className={styles.mainDescription} />

        <p className={styles.subDescription}>بنوكي | جميع الحقوق محفوظة</p>
      </footer>
    );
  }
}

export default FooterAr;
