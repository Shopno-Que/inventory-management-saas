import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}