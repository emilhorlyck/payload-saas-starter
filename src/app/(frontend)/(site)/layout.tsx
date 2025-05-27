import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { Navbar } from '@/components/ui/NavBar'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
