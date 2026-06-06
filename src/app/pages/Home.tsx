import Hero from "../components/Hero";
import About from "../components/About";
import QuickLinks from "../components/QuickLinks";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import GitHubCalendar from "../components/GithubContribution";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      {/* <QuickLinks /> */}
      <Skills />
      <Projects />
      <Experience />
      <Achievements />
      <Testimonials />
      <GitHubCalendar />
      <Blog />
      {/* <DesignPhilosophy /> */}
      <Contact />
    </main>
  );
}
