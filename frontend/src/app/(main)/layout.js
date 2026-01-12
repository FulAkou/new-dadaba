import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </div>
  );
}
