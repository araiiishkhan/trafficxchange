import Header from "./Header";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className={`py-4 sm:py-6 md:py-8 ${isMobile ? 'px-2' : ''}`}>
        {children}
      </main>
    </div>
  );
}
