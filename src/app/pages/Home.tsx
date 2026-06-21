import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import GitHubCalendar from "../components/GithubContribution";
import { PORTFOLIO_USER_ID } from "../config";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      {/* <QuickLinks /> */}
      <Skills />
      <Projects />
      <Experience userId={PORTFOLIO_USER_ID} />
      <Achievements userId={PORTFOLIO_USER_ID} />
      <Testimonials userId={PORTFOLIO_USER_ID} />
      <GitHubCalendar />
      <Blog />
      {/* <DesignPhilosophy /> */}
      <Contact />
    </main>
  );
}
