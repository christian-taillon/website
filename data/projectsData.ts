interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Log4Shell Hunting',
    description: `Comprehensive threat hunting guide and detection rules for the Log4Shell (CVE-2021-44228)
    vulnerability. Includes Splunk queries, YARA rules, and indicators of compromise to help security
    teams detect and respond to exploitation attempts.`,
    imgSrc: '/static/images/github.png',
    href: 'https://github.com/christian-taillon/log4shell-hunting',
  },
  {
    title: 'Sunburst Hunting',
    description: `Detection and hunting resources for the SolarWinds Sunburst supply chain attack.
    Features threat hunting queries, detection logic, and analysis techniques for identifying
    compromised systems and lateral movement.`,
    imgSrc: '/static/images/github.png',
    href: 'https://github.com/christian-taillon/sunburst-hunting',
  },
  {
    title: 'OpenWebUI Contributions',
    description: `Active contributions to OpenWebUI, an extensible, feature-rich, and user-friendly
    self-hosted WebUI designed to operate entirely offline. Supporting various LLM runners including
    Ollama and OpenAI-compatible APIs.`,
    imgSrc: '/static/images/github.png',
    href: 'https://openwebui.com/u/christiant/',
  },
  {
    title: 'ACTRA - Arizona Cyber Threat Response Alliance',
    description: `Director of Threat Intelligence for ACTRA, a collaborative initiative bringing together
    cybersecurity professionals across Arizona to share threat intelligence, best practices, and defend
    against cyber threats through community-driven efforts.`,
    imgSrc: '/static/images/actra.png',
    href: 'https://actraaz.org/',
  },
]

export default projectsData
