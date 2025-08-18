// All components mapping with path for internal routes

import { lazy } from "react";

const News = lazy(() => import("../pages/protected/News"));
const Blog = lazy(() => import("../pages/protected/Blog"));
const WhoWeAre = lazy(() => import("../pages/protected/WhoWeAre"));
const OurGoals = lazy(() => import("../pages/protected/OurGoals"));
const Career = lazy(() => import("../pages/protected/career"));
const CareerApplicant = lazy(() =>
  import("../pages/protected/career-applicant")
);
const About = lazy(() => import("../pages/protected/about"));
const ContactMessages = lazy(() =>
  import("../pages/protected/ContactMessages")
);
const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Charts = lazy(() => import("../pages/protected/Charts"));
const Leads = lazy(() => import("../pages/protected/Leads"));
const Integration = lazy(() => import("../pages/protected/Integration"));
const Calendar = lazy(() => import("../pages/protected/Calendar"));
const Team = lazy(() => import("../pages/protected/Team"));
const Transactions = lazy(() => import("../pages/protected/Transactions"));
const Bills = lazy(() => import("../pages/protected/Bills"));
const Contact = lazy(() => import("../pages/protected/Contact"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);
const WhyChooseUs = lazy(() => import("../pages/protected/WhyChooseUs"));

const GettingStarted = lazy(() => import("../pages/GettingStarted"));
const DocFeatures = lazy(() => import("../pages/DocFeatures"));
const DocComponents = lazy(() => import("../pages/DocComponents"));
const Partnership = lazy(() => import("../pages/protected/Parntership"));
const Info = lazy(() => import("../pages/protected/Info"));
const Services = lazy(() => import("../pages/protected/Services"));
const Teams = lazy(() => import("../pages/protected/Teams"));
const Testimonial = lazy(() => import("../pages/protected/Testimonial"));
const Projects = lazy(() => import("../pages/protected/Projects"));
const Achievement = lazy(() => import("../pages/protected/achievements"));
const FaqPage = lazy(() => import("../pages/protected/faq"));
const ConsultationPage = lazy(() => import("../pages/protected/consultation"));
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/welcome", // the url
    component: Dashboard, // view rendered
  },
  //{
  //  path: "/about",
  //  component: Leads,
  //},
  {
    path: "/projects",
    component: Projects,
  },
  {
    path: "/info",
    component: Info,
  },
  {
    path: "/settings-team",
    component: Team,
  },
  //{
  //  path: "/careers",
  //  component: Calendar,
  //},
  {
    path: "/blogs",
    component: Blog,
  },
  {
    path: "/contact",
    component: Contact,
  },
  {
    path: "/news",
    component: News,
  },
  {
    path: "/faq",
    component: FaqPage,
  },
  {
    path: "/consultation",
    component: ConsultationPage,
  },
  {
    path: "/services",
    component: Services,
  },
  {
    path: "/teams",
    component: Teams,
  },
  {
    path: "/testimonials",
    component: Testimonial,
  },
  {
    path: "/partners",
    component: Partnership,
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/settings-billing",
    component: Bills,
  },
  {
    path: "/getting-started",
    component: GettingStarted,
  },
  {
    path: "/features",
    component: DocFeatures,
  },
  {
    path: "/components",
    component: DocComponents,
  },
  {
    path: "/integration",
    component: Integration,
  },
  {
    path: "/video",
    component: Leads,
  },
  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/achievements",
    component: Achievement,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/contact-us",
    component: ContactMessages,
  },
  {
    path: "/why-choose-us",
    component: WhyChooseUs,
  },
  {
    path: "/career",
    component: Career,
  },
  {
    path: "/career-applicant",
    component: CareerApplicant,
  },
  {
    path: "/who-we-are",
    component: WhoWeAre,
  },
  {
    path: "/our-goals",
    component: OurGoals,
  },
];

export default routes;
