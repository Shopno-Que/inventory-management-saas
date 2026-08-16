import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "@/app/globals.css";
import NextTopLoader from "nextjs-toploader";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";

const hindSiliguri = Hind_Siliguri({
    display: "swap",
    subsets: ["bengali", "latin"],
    variable: "--next-font-hind-siliguri",
    weight: ["300", "400", "500", "600", "700"],
});

const notoSansBengali = Noto_Sans_Bengali({
    display: "swap",
    subsets: ["bengali", "latin"],
    variable: "--next-font-noto-sans-bengali",
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
    title: "হিসাব খাতা",
    description:
        "বাংলাদেশের ছোট ব্যবসার জন্য সহজ POS এবং ইনভেন্টরি ম্যানেজমেন্ট।",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="bn"
            className={`${hindSiliguri.variable} ${notoSansBengali.variable} antialiased`}
        >
            <body className="font-sans">
                <NextTopLoader color="#422ad5" showSpinner={false} />

                <NavigationProvider>
                    {children}
                </NavigationProvider>
            </body>
        </html>
    );
}