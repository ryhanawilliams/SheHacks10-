// tutorial.jsx
import React from "react";
import Heart3 from "../assets/Heart3.png";
import Heart2 from "../assets/Heart2.png";

function HeartIcon({ filled }) {
  return (
    <img
      src={filled ? Heart2 : Heart3}
      alt={filled ? "Liked" : "Like"}
      className="block w-[24px] h-[24px]"
    />
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
  return <h2 className="text-lg font-semibold text-zinc-900">{children}</h2>;
}

function StepHeading({ index, title }) {
  return (
    <h3 className="text-lg font-semibold text-zinc-900 mb-2">
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
  steps = [],
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-zinc-900">{title}</h1>

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
      <div className="mt-2">
        <ImageBox
          src={hero?.src}
          alt={hero?.alt || title}
          className="h-[240px] sm:h-[280px]"
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
        {/* Preparation + Materials (1:1 split; image on RIGHT) */}
        {materials ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Left: materials text */}
            <div className="order-1 space-y-3">
              <SectionHeading>
                {materials.heading || "Preparation & Materials"}
              </SectionHeading>

              <div className="space-y-4 text-sm text-zinc-700">
                {materials.sections?.map((sec) => (
                  <div key={sec.title} className="space-y-2">
                    <div className="font-semibold text-zinc-900">
                      {sec.title}
                    </div>

                    {sec.body ? <p className="leading-6">{sec.body}</p> : null}

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

            {/* Right: materials image */}
            <div className="order-2">
              <ImageBox
                src={materials.image?.src}
                alt={materials.image?.alt}
                className="h-[220px] md:h-[320px]"
              />
            </div>
          </div>
        ) : null}

        {/* Steps (1:1 split; alternate image left/right; Step 1 image LEFT) */}
        <div className={materials ? "mt-12 space-y-12" : "space-y-12"}>
          {steps.map((step, idx) => {
            const stepNumber = idx + 1;
            const imageOnLeft = stepNumber % 2 === 1; // step 1 left, step 2 right, ...

            // On mobile: keep TEXT first, IMAGE second for readability
            // On desktop: alternate image left/right
            const imageColClass = imageOnLeft
              ? "order-2 md:order-1"
              : "order-2 md:order-2";
            const textColClass = imageOnLeft
              ? "order-1 md:order-2"
              : "order-1 md:order-1";

            return (
              <div
                key={`${idx}-${step.title}`}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
              >
                {/* Image */}
                <div className={imageColClass}>
                  <ImageBox
                    src={step.image?.src}
                    alt={step.image?.alt || `Step ${stepNumber}`}
                    className="h-[220px] md:h-[320px]"
                  />
                </div>

                {/* Text */}
                <div className={textColClass}>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
