import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

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
  title: "হিসাব খাতা - ইনভেন্টরি ম্যানেজমেন্ট সলিউশন",
  description:
    "বাংলাদেশের জন্য সবচেয়ে সহজ এবং শক্তিশালী ইনভেন্টরি ম্যানেজমেন্ট সফটওয়্যার। আপনার ব্যবসা বৃদ্ধি করুন স্মার্ট সমাধানের সাথে।",
};

export default function RootLayout({children}) {
  return (
    <html
      className={`${hindSiliguri.variable} ${notoSansBengali.variable} antialiased`}
      lang="bn"
    >
      <body className="font-sans">
        <NextTopLoader color="#422ad5" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
