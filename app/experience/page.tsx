import Link from "next/link"

export default function ExperiencePage() {
  return (
    <main className="min-h-[80vh] bg-background text-foreground px-4 py-12 md:px-8">
      <header className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-pretty">Trainings</h1>
        <div className="mt-2 h-1 w-16 rounded bg-primary" aria-hidden="true" />
        <p className="mt-2 text-muted-foreground">
          A concise list of my relevant experiences and trainings. Select any item to learn more or view related
          certifications.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-5xl">
        <ul className="grid gap-4 md:grid-cols-2">
          <li className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
            <h3 className="font-medium">Intern At SkillCraft Technology   </h3>
            <p className="text-sm text-muted-foreground">
              {"Gained hands-on experience in:\n\n1. Data analysis and preprocessing\n\n2. ML model development (K-Means, SVM, Linear Regression)\n\n3. Image classification and real-time gesture recognition using OpenCV\n4. Model evaluation, optimization, and interactive GUI building"}
            </p>
            <Link href="/certifications" className="mt-2 inline-flex text-sm text-primary underline">
              View related certifications
            </Link>
          </li>
          <li className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
            <h3 className="font-medium">Python Developer Trainee — Example Institute</h3>
            <p className="text-sm text-muted-foreground">
              Jan 2024 – Mar 2024 · API development and unit testing fundamentals.
            </p>
            <Link href="/certifications" className="mt-2 inline-flex text-sm text-primary underline">
              View related certifications
            </Link>
          </li>
          <li className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
            <h3 className="font-medium">Training: Computer Vision with OpenCV</h3>
            <p className="text-sm text-muted-foreground">Hands‑on image processing and real‑time inference.</p>
            <Link href="/certifications" className="mt-2 inline-flex text-sm text-primary underline">
              View related certifications
            </Link>
          </li>
          <li className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
            <h3 className="font-medium">Workshop: Data Science with Scikit‑learn</h3>
            <p className="text-sm text-muted-foreground">Practical ML workflows, model selection, and metrics.</p>
            <Link href="/certifications" className="mt-2 inline-flex text-sm text-primary underline">
              View related certifications
            </Link>
          </li>
        </ul>

        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/certifications"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Go to Certifications
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}
