// Simulates how the invoice Blink renders inside an X (Twitter) timeline.
export default function BlinkPreview(props: { iconUrl: string; title: string; description: string; domain: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-4 text-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-sky-600" />
        <div>
          <div className="font-semibold">You <span className="font-normal text-slate-500">@freelancer · now</span></div>
          <div className="text-slate-200">Invoice is ready — pay in one click ⚡ #Solana #Blinks</div>
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-[#0d0d0d]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={props.iconUrl} alt="Invoice banner" className="aspect-[1200/630] w-full object-cover" />
        <div className="space-y-1 p-3">
          <div className="text-xs text-slate-500">{props.domain}</div>
          <div className="font-semibold">{props.title}</div>
          <div className="text-xs text-slate-400">{props.description}</div>
          <div className="pt-2">
            <span className="inline-block w-full rounded-lg bg-teal-400 py-2 text-center font-semibold text-black">Pay Invoice</span>
          </div>
        </div>
      </div>
    </div>
  );
}
