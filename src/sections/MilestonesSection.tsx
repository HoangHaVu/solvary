import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTag } from "../components/ui/SectionTag";

// Sicherstellen, dass das Plugin registriert ist, auch wenn die Komponente
// an anderer Stelle verwendet wird.
gsap.registerPlugin(ScrollTrigger);

interface Milestone {
  num: string;
  subtitle?: string;
  title: string;
  description: string;
  details?: string[];
}

interface MilestonesSectionProps {
  tag: string;
  headingLine1: string;
  headingLine2: string;
  milestones: Milestone[];
}

export default function MilestonesSection({
  tag,
  headingLine1,
  headingLine2,
  milestones,
}: MilestonesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      const heading = sectionRef.current?.querySelector(".milestones-heading");
      if (heading) {
        const tween = gsap.fromTo(
          heading,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 85%", once: true },
          },
        );
        if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger);
      }

      // Progress line fill
      if (progressRef.current && sectionRef.current) {
        const progressTween = gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 0.5,
            },
          },
        );
        if (progressTween.scrollTrigger) {
          triggersRef.current.push(progressTween.scrollTrigger);
        }
      }

      // Item reveal + dot activation
      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const card = item.querySelector(".milestone-card");
        const isEven = index % 2 === 0;

        if (card) {
          const tween = gsap.fromTo(
            card,
            { x: isEven ? -40 : 40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                once: true,
              },
            },
          );
          if (tween.scrollTrigger)
            triggersRef.current.push(tween.scrollTrigger);
        }

        const dot = dotRefs.current[index];
        if (dot) {
          const dotTrigger = ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => dot.classList.add("active"),
            onEnterBack: () => dot.classList.add("active"),
            onLeave: () => dot.classList.remove("active"),
            onLeaveBack: () => dot.classList.remove("active"),
          });
          triggersRef.current.push(dotTrigger);
        }
      });
    }, sectionRef);

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="bg-brand-bg-alt py-20 md:py-28 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="mb-8">
          <SectionTag>{tag}</SectionTag>
        </div>

        <div className="milestones-heading mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-brand-secondary leading-[1.05] tracking-tight">
            {headingLine1}
            <br />
            {headingLine2}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Baseline */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-1/2" />
          {/* Progress line */}
          <div
            ref={progressRef}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-brand-primary md:-translate-x-1/2 origin-top"
          />

          <div className="space-y-16 lg:space-y-24">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 ${
                    isEven ? "md:text-right" : "md:text-left"
                  }`}
                >
                  {/* Dot */}
                  <div
                    ref={(el) => {
                      dotRefs.current[index] = el;
                    }}
                    className="absolute left-6 md:left-1/2 top-2 w-3 h-3 rounded-full bg-white border border-gray-300 md:-translate-x-1/2 transition-colors duration-300 milestone-dot"
                  />

                  {/* Card */}
                  <div
                    className={`pl-16 md:pl-0 ${
                      isEven
                        ? "md:col-start-1 md:pr-16"
                        : "md:col-start-2 md:pl-16"
                    }`}
                  >
                    <div className="milestone-card">
                      <span className="inline-flex items-center rounded-full bg-brand-primary px-2.5 py-0.5 text-xs font-bold text-brand-secondary uppercase tracking-wider">
                        {milestone.num}
                      </span>
                      {milestone.subtitle && (
                        <span className="block text-xs font-medium uppercase tracking-wider text-gray-400 mt-3 mb-3">
                          {milestone.subtitle}
                        </span>
                      )}
                      <h3 className="text-2xl lg:text-3xl font-semibold text-brand-secondary mb-3">
                        {milestone.title}
                      </h3>
                      <p
                        className={`text-base text-gray-600 leading-relaxed max-w-md ${
                          isEven ? "md:ml-auto" : ""
                        }`}
                      >
                        {milestone.description}
                      </p>
                      {milestone.details && milestone.details.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {milestone.details.map((detail, i) => (
                            <li
                              key={i}
                              className={`flex items-start gap-2 text-sm text-gray-500 ${
                                isEven ? "md:justify-end" : ""
                              }`}
                            >
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-brand-primary flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .milestone-dot.active {
          background-color: rgb(var(--color-primary));
          border-color: rgb(var(--color-primary));
        }
      `}</style>
    </section>
  );
}
