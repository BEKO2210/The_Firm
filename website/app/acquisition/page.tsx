export const dynamic = "force-dynamic";

const CHANNELS = [
  { name: "Inbound (SEO)", status: "Day 1: page deployed, no traffic yet" },
  { name: "Content Marketing", status: "First post scheduled Day 45 (OKR O2.KR4)" },
  { name: "OSS Reputation", status: "First repo to publish Day 90+" },
  { name: "Ethical Outbound", status: "Not started — needs ICP definition" },
  { name: "Referral Program", status: "Activates after first paid engagement" },
  { name: "Paid Ads", status: "Budget reserved, not active" },
  { name: "Partnerships", status: "Not started" },
  { name: "Events", status: "Calendar scan quarterly" },
];

export default function AcquisitionPage() {
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">Customer Acquisition (as a Service)</h1>
        <p className="text-slate-400 mt-1">All 8 channels enabled. Service offered to principal for principal's customers (§27).</p>
      </header>
      <section className="card">
        <h2 className="text-lg font-semibold text-white mb-3">Channels</h2>
        <ul className="space-y-2 text-sm">
          {CHANNELS.map(c => (
            <li key={c.name} className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-white">{c.name}</span>
              <span className="text-slate-400">{c.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
