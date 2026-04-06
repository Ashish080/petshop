import Link from "next/link";
import { ChevronRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OffersBanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-[--radius-2xl] border border-border bg-text-primary p-8 shadow-soft md:p-12 lg:p-16">
          <div className="absolute -right-16 -top-20 h-80 w-80 rounded-full bg-brand/20 blur-[120px]" />
          <div className="absolute -bottom-20 -left-14 h-80 w-80 rounded-full bg-accent/14 blur-[120px]" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-2 text-label-sm uppercase tracking-[0.12em] text-brand">
                <Gift size={14} />
                Member offer
              </div>
              <h2 className="mt-5 text-display text-text-inverse">Save 20% on grooming</h2>
              <p className="mt-3 text-body-lg text-white/65">
                First booking benefit for members. Premium hygiene, gentle care, faster scheduling.
              </p>
            </div>

            <Link href="/services#grooming">
              <Button
                size="lg"
                variant="primary"
                iconRight={<ChevronRight size={20} />}
                className="!rounded-full !px-8"
              >
                Claim offer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
