import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">About MCP Registry Analytics</h1>
        <p className="text-gray-400 mt-2">
          Understanding the Model Context Protocol server ecosystem
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-gray-100 mb-3">What is MCP?</h2>
          <p className="text-gray-300 leading-relaxed">
            The Model Context Protocol (MCP) is an open protocol that standardizes how applications
            provide context to Large Language Models (LLMs). MCP enables developers to build servers
            that expose data and functionality to LLM-powered applications in a secure, standardized way.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Server Types</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-medium text-blue-400">Local Servers</h3>
              <p className="text-gray-300 leading-relaxed mt-1">
                Local servers run as processes on the user's machine. They are distributed as npm packages
                and provide access to local resources like filesystems, databases, or system APIs. These
                servers offer maximum privacy and control since all data stays on the user's device.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-pink-400">Remote Servers</h3>
              <p className="text-gray-300 leading-relaxed mt-1">
                Remote servers run as web services and are accessed over HTTP/SSE connections. They provide
                access to cloud services, APIs, and shared resources. Remote servers enable collaboration
                and access to data that doesn't reside on the local machine.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Data Collection</h2>
          <p className="text-gray-300 leading-relaxed">
            This dashboard tracks server counts from the official MCP Registry at{" "}
            <a
              href="https://registry.modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              registry.modelcontextprotocol.io
            </a>
            . Data is collected hourly via a GitHub Actions workflow running a PowerShell script.
            The script queries the registry API endpoint, classifies servers by type (local vs. remote
            based on package/remote properties), and appends timestamped snapshots to a CSV file.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Classification Logic</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Servers with a <code className="text-sm bg-gray-800 px-2 py-1 rounded">packages</code> property are counted as <span className="text-blue-400">local</span></li>
            <li>Servers with a <code className="text-sm bg-gray-800 px-2 py-1 rounded">remotes</code> property are counted as <span className="text-pink-400">remote</span></li>
            <li>Servers with both properties are counted in both categories</li>
            <li>The total count represents unique servers in the registry</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">Frontend</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Next.js 14 (App Router, Static Export)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Recharts</li>
                <li>Radix UI</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">Infrastructure</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>PowerShell Core (data collection)</li>
                <li>GitHub Actions (Windows runner)</li>
                <li>CSV file storage</li>
                <li>Static site deployment</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Real-time visualization of MCP server growth trends</li>
            <li>Filter by server type (All, Local only, Remote only)</li>
            <li>Adjustable time granularity (Hourly, Daily, Weekly, Monthly)</li>
            <li>Responsive design supporting 320px to 4K displays</li>
            <li>Dark theme optimized for readability</li>
            <li>Fast load times (&lt;3s) with static generation</li>
          </ul>
        </section>

        <section className="pt-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            This project is built as a static site with minimal dependencies, following modern web development
            best practices. Data updates hourly via automated workflows. For questions or contributions,
            please refer to the project repository.
          </p>
        </section>
      </Card>
    </div>
  )
}
