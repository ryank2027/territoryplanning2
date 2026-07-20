import { Layers, Map, ShieldCheck, Sparkles } from 'lucide-react'
import { SEGMENTATION_GUARDRAILS } from '@/lib/planning'
import { PageHeader } from '@/components/primitives/page-header'
import { SectionCard } from '@/components/primitives/section-card'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { ThreeLenses } from '@/components/primitives/three-lenses'
import { Disclaimer } from '@/components/primitives/disclaimers'
import {
  InputsOutputsLens,
  SalesforceLaneCard,
} from '@/components/prerequisites/lens-content'
import { GeographyHierarchy } from '@/components/planning/geography-hierarchy'
import { BuExplorer } from '@/components/planning/bu-explorer'
import { GuardrailGrid } from '@/components/planning/guardrail-grid'

const SF_LANES = [
  {
    define:
      'RevOps designs a hybrid model per BU from building blocks—geography, industry, size, and product—weighted per business unit. Assignment rules then sort accounts into the structure.',
    object: 'Territory structure built in the Territory objects',
    fields: 'market, vertical, size, product; rules sort accounts in',
  },
]

export default function SegmentationPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Territory Planning · Decision 01"
        title="Segmentation Strategy"
        lede="Hybrid segmentation puts geography at the core, with BU-specific dimensions layered on top. Standardize the top of the hierarchy across BUs and let lower levels diverge by business need."
        capability={['L3.1.1', 'L3.1.2', 'L3.1.4']}
      />

      <InsightPanel title="Key takeaway" icon={Sparkles} tone="green">
        Geography anchors the hierarchy; BU-specific dimensions layer on top. The
        top of the tree is standardized across every business unit for clean
        roll-up. What differs by BU is the segmentation cuts and resulting mix,
        not the downstream math.
      </InsightPanel>

      <SectionCard
        title="Geography hierarchy"
        description="A clean four-level backbone, shared across every business unit."
        icon={Map}
      >
        <GeographyHierarchy />
      </SectionCard>

      <SectionCard
        title="Business unit explorer"
        description="Choose a BU to see its thesis and ordered cuts. Switch to Scenario to reorder or disable dimensions and preview the impact."
        icon={Layers}
      >
        <BuExplorer />
      </SectionCard>

      <SectionCard
        title="Segmentation design guardrails"
        description="Rules that keep the model consistent, governable, and executable."
        icon={ShieldCheck}
      >
        <div className="flex flex-col gap-4">
          <GuardrailGrid items={SEGMENTATION_GUARDRAILS} />
          <Disclaimer kind="guardrails" />
        </div>
      </SectionCard>

      <ThreeLenses
        content={{
          inputsOutputs: (
            <InputsOutputsLens
              inputs={[
                'Confirmed geographic market boundaries by BU',
                'Agreed vertical taxonomy (Corporate, Gov/Non-Profit, etc.)',
                'Revenue and company size data per account',
                'ICP definition and account exclusion criteria',
                'Full account roster',
                'Confirmed product / venue type taxonomy (Hospitality Cloud)',
              ]}
              outputs={[
                'Formalized territory structure by market, vertical, company size, and product per BU',
                'Clear account ownership',
                'Territory hierarchy in Salesforce (parent–child)',
                'Exceptions list with reason codes by BU',
              ]}
            />
          ),
          salesforce: (
            <div className="flex flex-col gap-3">
              {SF_LANES.map((lane) => (
                <SalesforceLaneCard key={lane.object} lane={lane} />
              ))}
              <Disclaimer kind="architecture" />
            </div>
          ),
        }}
      />
    </div>
  )
}
