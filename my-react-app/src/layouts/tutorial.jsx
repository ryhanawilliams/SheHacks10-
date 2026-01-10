// TutorialLayout.jsx
import React from "react";

/**
 * TutorialLayout
 * Reusable layout for tutorial pages.
 *
 * Props:
 * - title: string
 * - liked: boolean
 * - onToggleLike?: () => void
 * - hero: { src?: string, alt?: string }
 * - meta?: { badgeLeft?: string, readTime?: string }   // e.g. "AI Generated Tutorial", "3-minute craft"
 * - materials?: {
 *     heading?: string,
 *     sections: Array<{ title: string, body?: string, bullets?: string[] }>,
 *     image?: { src?: string, alt?: string }
 *   }
 * - steps: Array<{
 *     title: string,
 *     intro?: string,
 *     bullets?: string[],
 *     notes?: string[],
 *     image?: { src?: string, alt?: string }
 *   }>
 */

function HeartIcon({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="block"
    >
      <path
        d="M12 21s-7.2-4.6-9.6-8.7C.7 9.2 2.2 5.9 5.6 5.2c1.8-.4 3.6.3 4.8 1.6 1.2-1.3 3-2 4.8-1.6 3.4.7 4.9 4 3.2 7.1C19.2 16.4 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageBox({ src, alt, className = "" }) {
  if (!src) {
    return (
      <div
        className={[
          "grid w-full place-items-center rounded-2xl bg-zinc-200 text-xs font-semibold text-zinc-600",
          className,
        ].join(" ")}
      >
        IMAGE
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Tutorial image"}
      className={["w-full rounded-2xl object-cover", className].join(" ")}
      loading="lazy"
    />
  );
}

function SectionHeading({ children }) {
  return <h2 className="text-sm font-semibold text-zinc-900">{children}</h2>;
}

function StepHeading({ index, title }) {
  return (
    <h3 className="text-sm font-semibold text-zinc-900">
      {index}. {title}
    </h3>
  );
}

export default function TutorialLayout({
  title,
  liked,
  onToggleLike,
  hero,
  meta = { badgeLeft: "AI Generated Tutorial", readTime: "" },
  materials,
  steps,
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-base font-semibold text-zinc-900">{title}</h1>

        <button
          type="button"
          onClick={onToggleLike}
          className="rounded-full p-1 text-zinc-900 hover:bg-zinc-100"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      {/* Hero image */}
      <div className="mt-3">
        <ImageBox
          src={hero?.src}
          alt={hero?.alt || title}
          className="h-[180px] sm:h-[220px]"
        />
      </div>

      {/* Meta row */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-1">
          <span className="text-blue-500">✦</span>
          <span>{meta?.badgeLeft || "AI Generated Tutorial"}</span>
        </div>
        {meta?.readTime ? <div>{meta.readTime}</div> : <div />}
      </div>

      {/* Body */}
      <div className="mt-5">
        {/* Preparation + Materials with image on right */}
        {materials ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {/* Left: materials text content */}
            <div className="md:col-span-2">
              <div className="space-y-3">
                <SectionHeading>
                  {materials.heading || "Preparation & Materials"}
                </SectionHeading>

                <div className="space-y-4 text-sm text-zinc-700">
                  {materials.sections?.map((sec) => (
                    <div key={sec.title} className="space-y-2">
                      <div className="font-semibold text-zinc-900">
                        {sec.title}
                      </div>
                      {sec.body ? (
                        <p className="leading-6">{sec.body}</p>
                      ) : null}
                      {sec.bullets?.length ? (
                        <ul className="list-disc space-y-1 pl-5 leading-6">
                          {sec.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: materials image */}
            {materials.image ? (
              <div className="md:col-span-1">
                <ImageBox
                  src={materials.image.src}
                  alt={materials.image.alt}
                  className="h-[200px] md:h-[280px]"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Steps - alternating layout */}
        <div className={materials ? "mt-8 space-y-8" : "space-y-8"}>
          {steps.map((step, idx) => {
            const stepNumber = idx + 1;
            const isOdd = stepNumber % 2 === 1;
            const isEven = stepNumber % 2 === 0;
            const imageOnLeft = isEven && Math.floor(idx / 2) % 2 === 0;
            const imageOnRight = isEven && Math.floor(idx / 2) % 2 === 1;

            // Odd steps: text only, no image
            if (isOdd) {
              return (
                <div key={`${idx}-${step.title}`} className="space-y-2">
                  <StepHeading index={stepNumber} title={step.title} />

                  {step.intro ? (
                    <p className="text-sm leading-6 text-zinc-700">
                      {step.intro}
                    </p>
                  ) : null}

                  {step.bullets?.length ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-700">
                      {step.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}

                  {step.notes?.length ? (
                    <div className="space-y-1 text-xs text-zinc-500">
                      {step.notes.map((n, i) => (
                        <div key={i}>• {n}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            // Even steps: with image alternating left/right
            return (
              <div
                key={`${idx}-${step.title}`}
                className={[
                  "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8",
                  imageOnLeft ? "md:flex-row-reverse" : "",
                ].join(" ")}
              >
                {/* Image */}
                {step.image?.src && imageOnLeft ? (
                  <div className="order-2 md:order-1">
                    <ImageBox
                      src={step.image.src}
                      alt={step.image.alt}
                      className="h-[200px] md:h-[280px]"
                    />
                  </div>
                ) : null}

                {/* Text content */}
                <div className={imageOnLeft ? "order-1 md:order-2" : "order-1"}>
                  <div className="space-y-2">
                    <StepHeading index={stepNumber} title={step.title} />

                    {step.intro ? (
                      <p className="text-sm leading-6 text-zinc-700">
                        {step.intro}
                      </p>
                    ) : null}

                    {step.bullets?.length ? (
                      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-700">
                        {step.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    ) : null}

                    {step.notes?.length ? (
                      <div className="space-y-1 text-xs text-zinc-500">
                        {step.notes.map((n, i) => (
                          <div key={i}>• {n}</div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Image on right */}
                {step.image?.src && imageOnRight ? (
                  <div className="order-2">
                    <ImageBox
                      src={step.image.src}
                      alt={step.image.alt}
                      className="h-[200px] md:h-[280px]"
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Example data (copy/paste into your page to test)
export function ExampleTutorialPage() {
  const [liked, setLiked] = React.useState(false);

  const tutorial = {
    title: "Upcycling Craft Title",
    hero: { src: "", alt: "Upcycling Craft Title" },
    meta: { badgeLeft: "AI Generated Tutorial", readTime: "3-minute craft" },
    liked,
    materials: {
      heading: "Preparation & Materials",
      sections: [
        {
          title: "Get Started",
          body: "Before you start, do a quick clean-up and set your workspace.",
        },
        {
          title: "Materials",
          bullets: ["Fabric scraps", "Scissors", "Glue (or thread + needle)", "Optional: charms"],
        },
      ],
      image: { src: "", alt: "Materials image" },
    },
    steps: [
      {
        title: "First step",
        intro: "Draft your shape and cut your fabric pieces.",
        bullets: ["Cut the base shape", "Cut the top layer", "Trim edges cleanly"],
        image: { src: "", alt: "Step 1 image" },
      },
      {
        title: "Second step",
        bullets: ["Align pieces", "Attach with glue or stitches", "Press flat while drying"],
      },
    ],
  };

  return (
    <TutorialLayout
      title={tutorial.title}
      hero={tutorial.hero}
      meta={tutorial.meta}
      liked={tutorial.liked}
      onToggleLike={() => setLiked((v) => !v)}
      materials={tutorial.materials}
      steps={tutorial.steps}
    />
  );
}
*/
