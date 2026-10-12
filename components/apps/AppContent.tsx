"use client";

import type { AppId } from "@/lib/portfolio/data";
import { AboutApp } from "@/components/apps/AboutApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { ExperienceApp } from "@/components/apps/ExperienceApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import { EducationApp } from "@/components/apps/EducationApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { ContactApp } from "@/components/apps/ContactApp";

export function AppContent({ id }: { id: AppId }) {
  switch (id) {
    case "about":
      return <AboutApp />;
    case "projects":
      return <ProjectsApp />;
    case "experience":
      return <ExperienceApp />;
    case "skills":
      return <SkillsApp />;
    case "education":
      return <EducationApp />;
    case "terminal":
      return <TerminalApp />;
    case "resume":
      return <ResumeApp />;
    case "contact":
      return <ContactApp />;
    default:
      return null;
  }
}
