import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CertificationsPage() {
  return (
    <main className="min-h-[80vh] px-4 py-12 md:px-8">
      <header className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Link href="/experience" aria-label="Back to Trainings">
            <Button variant="outline" size="sm">
              {"\u2190"} Back to Trainings
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-semibold text-pretty">Certifications</h1>
        <p className="mt-2 text-muted-foreground">
          Add your certification entries here. Link each to a verification page or PDF.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-5xl">
        <ul className="grid gap-4 md:grid-cols-2">
          <li id="skillcraft-lor" className="rounded-lg border bg-card text-card-foreground p-4">
            <h3 className="font-medium">SkillCraft Technology — Letter of Recommendation</h3>
            <p className="text-sm text-muted-foreground">Issued: 15 Aug 2025</p>
            <a
              href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lor-GH9uB8wyWitqkxsch715O4OAA68n3k.png"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-sm text-primary underline"
              aria-label="Open SkillCraft Technology Letter of Recommendation in a new tab"
            >
              View LOR
            </a>
            <div className="mt-3 overflow-hidden rounded-md border">
              {/* Using a standard img so the remote blob URL loads without Next Image config */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lor-GH9uB8wyWitqkxsch715O4OAA68n3k.png"
                alt="Letter of Recommendation from SkillCraft Technology"
                className="w-full h-auto"
              />
            </div>
          </li>
        </ul>
      </section>
    </main>
  )
}
