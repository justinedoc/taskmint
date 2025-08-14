import organisations from "@/assets/images/organisations.png";
import Marquee from "react-fast-marquee";

export default function Cooperations() {
  const logos: string[] = new Array(3).fill(organisations);

  return (
    <article className="flex h-40 flex-col items-center justify-center">
      <h2 className="text-center text-xl font-semibold text-[#4E4E4E] mb-4">
        Trusted by the world's most innovative teams
      </h2>
      <Marquee
        speed={50}
        gradient={false}
        pauseOnHover={true}
        className="inline-flex gap-8"
      >
        {logos.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="Organisation Logo"
            className="mx-4 h-8 w-full object-contain"
          />
        ))}
      </Marquee>
    </article>
  );
}
