import type { Metadata } from 'next'
import { Table2, Workflow } from 'lucide-react'
import { PageHeader } from '@/components/primitives/page-header'
import { Disclaimer } from '@/components/primitives/disclaimers'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { SystemOfTruth } from '@/components/prerequisites/system-of-truth'
import { TranslationFlow } from '@/components/prerequisites/translation-flow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'Inputs / Outputs & Salesforce Translation | Prerequisites',
  description:
    'The prerequisite operating model: what flows in and out of each element, and how each definition is represented in Salesforce.',
}

export default function InputsOutputsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Prerequisites: Inputs / Outputs & Salesforce Translation"
        title="Inputs / Outputs & Salesforce Translation"
        lede="Two views of the prerequisite operating model: what each element consumes and produces, and how each definition is represented in Salesforce before planning begins."
      />

      <Tabs defaultValue="matrix" className="gap-5">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-1.5 rounded-xl bg-muted p-1.5 sm:w-auto sm:grid-cols-2">
          <TabsTrigger
            value="matrix"
            className="flex items-center gap-2 rounded-lg px-4 py-2 data-active:bg-surface data-active:shadow-sm"
          >
            <Table2 className="size-4 text-brand-teal" aria-hidden />
            Inputs / Outputs
          </TabsTrigger>
          <TabsTrigger
            value="flow"
            className="flex items-center gap-2 rounded-lg px-4 py-2 data-active:bg-surface data-active:shadow-sm"
          >
            <Workflow className="size-4 text-brand-teal" aria-hidden />
            Salesforce Translation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="flex flex-col gap-4">
          <Eyebrow tone="sage">Prerequisite operating model</Eyebrow>
          <SystemOfTruth />
        </TabsContent>

        <TabsContent value="flow" className="flex flex-col gap-4">
          <Eyebrow tone="sage">Define, then store in Salesforce</Eyebrow>
          <TranslationFlow />
        </TabsContent>
      </Tabs>

      <Disclaimer kind="architecture" />
    </div>
  )
}
