import Head from "next/head";
import Checkout from "../components/checkout/checkout";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";

function CheckoutPage() {
    return ( 
        <>
            <Head>
                <title>Checkout Page</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Checkout />
            <Footer />
        </>
     );
}

export default CheckoutPage;