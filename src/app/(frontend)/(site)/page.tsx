import { BentoGridDemo } from '@/components/blocks/BentoGrid'
import { Button } from '@/components/ui/button'
import { Check, Container } from 'lucide-react'
import { HeroSection } from '@/components/blocks/HeroSection'

import Link from 'next/link'

export default async function Index() {
  return <ToDelete />
}

// Delete and make this your homepage
const ToDelete = () => {
  const FeatureCategory = ({ title, features }: { title: string; features: string[] }) => {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <>
      <div>
        <HeroSection />
      </div>
      <div className="p-8">
        <BentoGridDemo />
      </div>
    </>
  )
}
