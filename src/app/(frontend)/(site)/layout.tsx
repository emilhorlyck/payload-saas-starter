import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
