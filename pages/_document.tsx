import Document, { DocumentContext, Html, Head, Main, NextScript } from "next/document";

import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: [initialProps.styles, sheet.getStyleElement()],
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link href="https://fonts.googleapis.com/css2?family=Cabin&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css2?family=Tajawal&display=swap" rel="stylesheet" />

                    <link
                        rel="stylesheet"
                        href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
                        integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
                        crossOrigin="anonymous"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
