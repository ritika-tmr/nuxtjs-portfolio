export const state = () => ({
  projectsHeading: "Projects Portfolio",
  projectsDescription: "Some of the projects I have successfully completed",
  projects: [
    {
      id: "260d1271-f1f2-4bc9-a5eb-05a89c8cccdb",
      title: "Roadmate",
      category: "Web/Mobile Application",
      img: "images/Roadmate-Front-Page.png",
      publishDate: "Nov, 2023",
      tag: "UI / Frontend",
      objectivesTitle: "Objective",
      objectivesDetails:
        "A mobile roadside assistance application connecting users with immediate help for their vehicle-related issues anytime, anywhere.",
      techTitle: "Tools & Technologies",
      detailsTitle: "Details",
      projectImages: [
        {
          id: 1,
          title: "Dashboard UI",
          img: "../images/Roadmate-Details-1.png",
        },
        {
          id: 2,
          title: "Details UI",
          img: "../images/Roadmate-Details-2.png",
        },
      ],
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Vue.js",
        "Quasar",
        "Figma",
      ],
      projectDetails: [
        {
          id: 1,
          details: "I orchestrated the development of a mobile application dashboard utilizing the Quasar framework, ensuring seamless compatibility across multiple platforms. Integral to the project was the integration of the Google Maps API, enriching the user experience with location-based functionalities. The user interface was crafted using Figma, prioritizing both aesthetic appeal and user-friendliness. This project underscores my proficiency in frontend development and commitment to delivering visually compelling and intuitive user interfaces."
        },
      ],
    },
    {
      id: "260d1271-f1f2-4bc9-a5eb-05a89c8cccdc",
      title: "Adult Education System",
      category: "Web Application",
      img: "images/education_4.png",
      publishDate: "April, 2023",
      tag: "UI/UX Design ",
      objectivesTitle: "Objective",
      objectivesDetails:
        "An Education System featuring a user-friendly dashboard tailored for both students and teachers to manage coursework, track progress, and facilitate effective communication.",
      techTitle: "Tools & Technologies",
      detailsTitle: "Details",
      projectImages: [
        {
          id: 1,
          title: "Education Dashboard",
          img: "../images/education_4.png",
        },
        {
          id: 3,
          title: "Education Teacher",
          img: "../images/education_1.png",
        },
        {
          id: 4,
          title: "Education Student",
          img: "../images/education_3.png",
        }
      ],
      technologies: [
        "Canva",
      ],
      projectDetails: [
        {
          id: 1,
          details:
          "The Education System is a versatile platform designed to streamline academic processes for both students and teachers. With a user-centric dashboard, students gain easy access to course materials, assignments, grades, and academic resources, empowering them to track their progress and stay organized throughout their educational journey. Teachers benefit from intuitive tools that facilitate efficient course management, grading, and communication with students. The platform fosters collaboration and engagement, creating a dynamic learning environment conducive to academic success."
        },
      ],
    },
    {
      id: "260d1271-f1f2-4bc9-a5eb-05a89c8cccdy",
      title: "Portfolio",
      category: "Website",
      img: "images/Portfolio.png",
      publishDate: "Nov , 2023",
      tag: "UI / Frontend",
      objectivesTitle: "Objective",
      objectivesDetails:
        "A portfolio designed to showcase my projects and provide insights into who I am as a professional.",
      techTitle: "Tools & Technologies",
      detailsTitle: "Details",
      projectImages: [
        {
          id: 1,
          title: "Education Dashboard",
          img: "../images/Portfolio.png",
        },
      ],
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Nuxt.js",
        "TailwindCSS",
        "Figma",
      ],
      projectDetails: [
        {
          id: 1,
          details:
          "A portfolio designed to showcase my projects and provide insights into who I am as a professional. Through carefully curated project displays, visitors can explore my expertise, creativity, and problem-solving abilities across various domains. Accompanied by personal anecdotes and insights, the \"About Me\" section offers a glimpse into my journey, passions, and aspirations, enriching the visitor's understanding of the person behind the projects. With a blend of visual appeal and informative content, the portfolio serves as a compelling narrative of my skills, experiences, and accomplishments, aimed at leaving a lasting impression on potential collaborators and employers alike."
        },
      ],
    },
  ],
  aboutMe: [
    {
      id: 1,
      bio: "Welcome to my web portfolio! My name is Ritika and I am a passionate and skilled Front End Web Developer with expertise in designing and developing user-friendly and visually appealing interfaces. " +
        "I invite you to explore my portfolio, where you will find a showcase of my work and projects that highlight my proficiency in creating dynamic and responsive web pages.\n" +
        "\n" +
        "With a strong background in HTML, CSS/SCSS, and JavaScript, I have successfully designed and implemented Front End User Interface designs for various software projects using frameworks like Angular and Vue. " +
        "I have a keen eye for detail and a deep understanding of user experience principles, which allows me to create intuitive and engaging interfaces that align with the clients' requirements.\n"
    },
    {
      id: 2,
      bio: "Throughout my career, I have collaborated closely with back-end developers and UI/UX teams, working hand in hand to deliver seamless and impactful user experiences. " +
        "I am adept at fixing bugs, adding minor features, and providing support for existing systems, ensuring their optimal functionality.\n",
    },
    {
      id: 3,
      bio: "I invite you to explore my portfolio and witness firsthand how I merge my technical skills, design expertise, and passion for user-centric experiences. " +
        "I am excited to collaborate on innovative projects and contribute to creating exceptional digital products. Let's connect and discuss how I can help bring your ideas to life!",
    },
  ],
  copyrightDate: new Date().getFullYear(),
  socialProfiles: [
    {
      id: 1,
      name: "GitHub",
      icon: "github",
      url: "https://github.com/ritika-tmr",
    },
    {
      id: 2,
      name: "Linkedin",
      icon: "linkedin",
      url: "https://www.linkedin.com/in/ritika-tamrakar/",
    },
  ],
  qualifications: [
    {
      id: 1,
      major: 'Data Analytics',
      institution: 'Western Sydney University',
      course: 'Masters in Information and Communication Technology',
      location: 'Sydney, Australia',
      img: '',
    },
    {
      id: 2,
      major: 'Computer Science and Technology',
      institution: 'Beijing University of Posts and Telecommunications',
      course: 'Bachelors of Engineering',
      location: 'Beijing, China',
      img: '',
    },
  ]
});

export const getters = {
  getProjectById: (state) => (id) => {
    return state.projects.find((project) => project.id === id);
  },
};

export const mutations = {
  // @todo
};

export const actions = {
  // @todo
};
