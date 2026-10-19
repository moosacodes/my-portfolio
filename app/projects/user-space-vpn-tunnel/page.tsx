import Link from "next/link";
import { PROFILE } from "@/lib/portfolio/data";

export default function UserSpaceVpnCaseStudy() {
  return (
    <main className="case-study">
      <Link href="/" className="case-back">← Back to the workbench</Link>
      <p className="eyebrow">Case study / network lab</p>
      <h1>User-Space VPN Tunnel</h1>
      <p className="case-intro">A Python learning project that moves raw IPv4 packets between Linux hosts over TUN devices and a framed UDP transport.</p>
      <div className="case-grid">
        <section><h2>The question</h2><p>What does a packet look like when it leaves the kernel, crosses a user-space process, and arrives at another host? This project keeps those boundaries explicit instead of hiding them behind a finished VPN library.</p></section>
        <section><h2>What I built</h2><ul><li>TUN adapter using <code>IFF_TUN | IFF_NO_PI</code></li><li>Lightweight protocol framing with magic, version, flags, sequence, and payload fields</li><li>Select-loop forwarder with larger socket buffers</li><li>Server/client command-line endpoints and Linux route/NAT scripts</li></ul></section>
        <section><h2>How I checked it</h2><p>The repository includes a unit-test gate, network test scripts, namespace benchmarking, and paired capture workflows for comparing outer UDP traffic with inner TUN traffic.</p></section>
        <section><h2>Honest boundary</h2><p>This is not presented as a production-secure VPN. The README documents throughput and packet-count benchmarks as targets and provides a path to prove them; the current public protocol is a compact learning implementation rather than an authenticated-encryption system.</p></section>
      </div>
      <a className="case-source" href="https://github.com/moosacodes/User-Space-VPN-Tunnel" target="_blank" rel="noreferrer">Open the source repository ↗</a>
      <p className="case-contact">Questions? <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></p>
    </main>
  );
}
