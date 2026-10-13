"""Generate Moosa_Alam_Resume_2026.pdf — run from repo root."""
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
)

OUT = Path(__file__).resolve().parents[1] / "public" / "Moosa_Alam_Resume_2026.pdf"

MARGIN = 0.55 * inch


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            spaceAfter=4,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor="#333333",
            spaceAfter=8,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            spaceBefore=8,
            spaceAfter=3,
            textColor="#111111",
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor="#222222",
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=11.5,
            leftIndent=10,
            bulletIndent=0,
            textColor="#222222",
            spaceAfter=1.5,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=12,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor="#444444",
        ),
    }


def hr():
    return HRFlowable(width="100%", thickness=0.8, color="#222222", spaceBefore=1, spaceAfter=4)


def row(left, right, s):
    return Table(
        [[Paragraph(left, s["role"]), Paragraph(right, s["meta"])]],
        colWidths=[5.2 * inch, 2.0 * inch],
    )


def bullets(items, s):
    return [Paragraph(f"- {item}", s["bullet"]) for item in items]


def build():
    s = styles()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.45 * inch,
        bottomMargin=0.45 * inch,
    )
    story = []

    story.append(Paragraph("Moosa Alam", s["name"]))
    story.append(
        Paragraph(
            "437-212-7641 | malam20@uoguelph.ca | linkedin.com/in/moosa-alam | "
            "github.com/moosacodes",
            s["contact"],
        )
    )

    story.append(Paragraph("Education", s["section"]))
    story.append(hr())
    story.append(
        row(
            "University of Guelph — Bachelor of Computing, Computer Science (Co-op)",
            "Guelph, ON",
            s,
        )
    )
    story.append(
        Paragraph(
            "Area of Emphasis: Cybersecurity · Expected Dec 2028",
            s["meta"],
        )
    )
    story.append(Spacer(1, 4))

    story.append(Paragraph("Technical Skills", s["section"]))
    story.append(hr())
    skills = [
        (
            "<b>Networking:</b> TCP/IP, IPv4/IPv6, Ethernet, Subnetting, VLANs, "
            "Routing &amp; Switching, DNS, DHCP, NAT, ACLs, VPNs, SSH"
        ),
        (
            "<b>Systems &amp; Tools:</b> Windows 10/11, Linux, PC Hardware, "
            "Workstation Setup, System Troubleshooting, Wireshark, tcpdump"
        ),
        "<b>Programming:</b> Python, Bash, C, Git",
    ]
    for line in skills:
        story.append(Paragraph(line, s["body"]))
        story.append(Spacer(1, 2))

    story.append(Paragraph("Experience", s["section"]))
    story.append(hr())

    story.append(row("AI Systems Engineering Intern — SYNK", "Remote", s))
    story.append(Paragraph("Apr 2026 – Sep 2026", s["meta"]))
    story.extend(
        bullets(
            [
                "Analyzed runtime telemetry to enhance platform reliability by 18% "
                "for over 60 concurrent users.",
                "Identified performance bottlenecks, leading to a 14% reduction in "
                "frame-time degradation.",
                "Conducted stress tests on concurrent workloads, resulting in 12% "
                "improved system performance through actionable optimization recommendations.",
            ],
            s,
        )
    )
    story.append(Spacer(1, 5))

    story.append(row("Software Engineer Intern — Vibez Music", "Toronto, ON", s))
    story.append(Paragraph("Jan 2026 – Apr 2026 · Hybrid", s["meta"]))
    story.extend(
        bullets(
            [
                "Developed Python and Flask tools that automated operational processes, "
                "improving workflow throughput by over 40%.",
                "Enhanced system reliability through structured logging, request "
                "validation, and error handling.",
                "Implemented automated testing and deployment using GitHub Actions "
                "CI/CD, resolving integration and production issues.",
            ],
            s,
        )
    )

    story.append(Paragraph("Projects", s["section"]))
    story.append(hr())

    story.append(
        row(
            "Virtualized Network Home Lab | Linux, Docker, GitHub Actions, Wireshark",
            "",
            s,
        )
    )
    story.extend(
        bullets(
            [
                "Built a segmented multi-host Linux network lab using isolated subnets, "
                "configuring IPv4 addressing, routing, DNS, DHCP, NAT, SSH, and firewall rules.",
                "Deployed containerized services through GitHub Actions CI/CD and validated "
                "connectivity using ping, traceroute, and application-level network tests.",
                "Captured and analyzed traffic with Wireshark and tcpdump to troubleshoot "
                "DNS resolution, TCP connections, routing behavior, and packet flow.",
            ],
            s,
        )
    )
    story.append(Spacer(1, 4))

    story.append(
        row(
            "User-Space VPN Tunnel | Python, Linux, TUN/TAP, UDP, Wireshark",
            "",
            s,
        )
    )
    story.extend(
        bullets(
            [
                "Built a point-to-point VPN using Linux TUN interfaces and UDP sockets to "
                "encapsulate and route IP packets between isolated network endpoints.",
                "Configured IP forwarding, routing tables, NAT, firewall rules, and "
                "authenticated encryption to securely transport network traffic through the tunnel.",
                "Analyzed packet flow with Wireshark and tcpdump to diagnose connectivity, "
                "latency, routing, and packet-loss issues across the tunnel.",
            ],
            s,
        )
    )

    story.append(Paragraph("Certifications", s["section"]))
    story.append(hr())
    story.append(
        Paragraph(
            "<b>AWS Certified Cloud Practitioner</b> — Expected Sep 2026 · Amazon Web Services",
            s["body"],
        )
    )
    story.append(Spacer(1, 2))
    story.append(
        Paragraph(
            "<b>Cisco Certified Network Associate (CCNA)</b> — Expected Dec 2026 · Cisco",
            s["body"],
        )
    )

    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
