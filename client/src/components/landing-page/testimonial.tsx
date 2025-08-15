import Section from "@/components/globals/section";
import Marquee from "react-fast-marquee";

function Testimonial() {
  return (
    <Section className="bg-gradient-to-b from-primary to-background min-h-screen">
      <Section.Header>
        <Section.Title>Testimonials</Section.Title>
        <Section.Description>See what people say about us!</Section.Description>
      </Section.Header>

      <Section.Body>
        <Marquee
          speed={50}
          gradient={false}
          pauseOnHover={true}
          className="inline-flex gap-8"
        >
          {["testing", "testing"].map((text, idx) => (
            <span key={idx}>{text}</span>
          ))}
        </Marquee>
      </Section.Body>
    </Section>
  );
}

export default Testimonial;
