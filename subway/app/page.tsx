'use client';

import { useState, useEffect, useRef } from 'react';

// Custom Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  href,
  className = '',
  icon,
  target,
  rel,
  'aria-label': ariaLabel,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]',
    secondary: 'bg-surface text-foreground border border-border-light hover:bg-surface-hover active:scale-[0.98]',
    ghost: 'text-foreground hover:bg-surface active:scale-[0.98]',
  };
  
  const sizes = {
    sm: 'h-9 px-4 text-sm gap-1.5',
    md: 'h-11 px-6 text-[15px] gap-2',
    lg: 'h-13 px-8 text-base gap-2.5',
  };
  
  const Component = href ? 'a' : 'button';
  
  return (
    <Component
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </Component>
  );
};

// Custom Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, [delay]);
  
  return (
    <div
      ref={cardRef}
      className={`
        floating-container
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Custom Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  return (
    <span className={`
      inline-flex items-center px-3 py-1 text-xs font-mono font-medium rounded-md
      ${variant === 'default' 
        ? 'bg-surface text-foreground border border-border-light' 
        : 'bg-transparent text-text-secondary border border-border'}
    `}>
      {children}
    </span>
  );
};

// Custom Section Header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, align = 'left' }) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Data
const experience = [
  {
    title: 'Senior Fullstack Developer',
    company: 'Tech Company',
    period: '2024 — Present',
    description: 'Building scalable SaaS applications and cross-platform solutions with modern technologies.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    current: true,
  },
  {
    title: 'Fullstack Developer',
    company: 'Startup Inc',
    period: '2022 — 2024',
    description: 'Developed web applications and founded multiple ventures, all successfully acquired.',
    technologies: ['Next.js', 'GraphQL', 'MongoDB', 'AWS'],
    current: false,
  },
  {
    title: 'Freelance Developer',
    company: 'Self-Employed',
    period: '2021 — 2022',
    description: 'Built custom solutions for clients worldwide, specializing in full-stack development.',
    technologies: ['JavaScript', 'React', 'Express', 'MySQL'],
    current: false,
  },
];

const projects = [
  {
    title: 'Shop Management System',
    description: 'Complete POS solution with invoice management, real-time dashboards, and inventory tracking.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Prisma'],
    image: 'S',
  },
  {
    title: '3D Web Platform',
    description: 'Immersive 3D visualizations and interactive experiences using modern web technologies.',
    technologies: ['Three.js', 'WebGL', 'React', 'TypeScript'],
    image: '3D',
  },
  {
    title: 'Developer Tools',
    description: 'Open-source packages and tools used by developers worldwide to improve productivity.',
    technologies: ['TypeScript', 'NPM', 'Node.js', 'Testing'],
    image: '⌘',
  },
  {
    title: 'Mobile Applications',
    description: 'Cross-platform mobile apps with native performance and seamless user experiences.',
    technologies: ['React Native', 'Expo', 'iOS', 'Android'],
    image: '◐',
  },
];

const techStack = [
  'TypeScript', 'JavaScript', 'React', 'Next.js',
  'Node.js', 'Python', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'REST', 'Docker', 'AWS',
  'Git', 'Figma', 'Linux', 'Redis',
];

const blogPosts = [
  {
    title: 'Building Scalable Systems',
    description: 'Lessons learned from architecting and scaling applications to millions of users.',
    date: 'Mar 15, 2025',
    readTime: '8 min read',
  },
  {
    title: 'The Art of Clean Code',
    description: 'Principles and practices for writing maintainable, readable, and efficient code.',
    date: 'Feb 28, 2025',
    readTime: '6 min read',
  },
  {
    title: 'Modern Web Performance',
    description: 'Advanced techniques for optimizing web applications for speed and user experience.',
    date: 'Feb 10, 2025',
    readTime: '10 min read',
  },
];

const contributions = Array.from({ length: 365 }, (_, i) => ({
  level: Math.floor(Math.random() * 5),
  date: new Date(2024, 0, 1 + i).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 20),
}));

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('about');
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = motionQuery.matches;
    
    // Initialize theme
    const isDarkMode = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Scroll progress listener
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
      
      // Update active section
      const sections = ['about', 'experience', 'projects', 'stack', 'writing'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (prefersReducedMotion.current) {
      const newDark = !isDark;
      setIsDark(newDark);
      document.documentElement.classList.toggle('dark');
      localStorage.theme = newDark ? 'dark' : 'light';
    } else {
      const newDark = !isDark;
      setIsDark(newDark);
      if (newDark) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
      }
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-600">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[1px] bg-border-light">
        <div 
          className="h-full bg-foreground transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-semibold text-lg transition-transform duration-500 group-hover:scale-105">
                S
              </div>
              <span className="font-semibold text-lg tracking-tight">Subway</span>
            </a>
            
            <div className="hidden md:flex items-center gap-1">
              {['About', 'Experience', 'Projects', 'Stack', 'Writing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                    ${activeSection === item.toLowerCase()
                      ? 'bg-surface text-foreground'
                      : 'text-text-secondary hover:text-foreground hover:bg-surface/50'}
                  `}
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-10 h-10 p-0"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                  </svg>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                href="https://github.com/subway"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 p-0"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Hero Section */}
        <section id="about" className="min-h-[80vh] flex items-center">
          <div className="w-full">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-light mb-6">
                <span className="w-2 h-2 rounded-full bg-foreground animate-subtle-pulse" />
                <span className="text-sm font-mono text-text-secondary">Available for opportunities</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 animate-fade-in-up delay-1">
              Building digital
              <br />
              <span className="text-text-secondary">experiences that matter.</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mb-10 animate-fade-in-up delay-2 leading-relaxed">
              Design Engineer & Fullstack Developer with 4+ years of experience crafting 
              clean, scalable solutions. Founded multiple ventures and passionate about 
              creating exceptional user experiences.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-3">
              <Button size="lg" href="#projects">
                View Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Button>
              <Button size="lg" variant="secondary" href="#contact">
                Get in Touch
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 mt-16 pt-16 border-t border-border-light animate-fade-in-up delay-4">
              <div>
                <div className="text-3xl font-semibold mb-1">4+</div>
                <div className="text-sm text-text-secondary font-mono">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-semibold mb-1">20+</div>
                <div className="text-sm text-text-secondary font-mono">Projects Shipped</div>
              </div>
              <div>
                <div className="text-3xl font-semibold mb-1">3</div>
                <div className="text-sm text-text-secondary font-mono">Ventures Founded</div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24">
          <SectionHeader 
            title="Experience" 
            subtitle="A journey through my professional career and the companies I've had the privilege to work with."
          />
          
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <Card key={index} delay={index * 100} className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{exp.title}</h3>
                      {exp.current && (
                        <Badge>Current</Badge>
                      )}
                    </div>
                    <p className="text-text-secondary font-mono text-sm">{exp.company}</p>
                  </div>
                  <span className="text-text-tertiary font-mono text-sm whitespace-nowrap">{exp.period}</span>
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <Badge key={i}>{tech}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24">
          <SectionHeader 
            title="Selected Work" 
            subtitle="A collection of projects that showcase my approach to solving complex problems."
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card key={index} delay={index * 100} className="group overflow-hidden">
                <div className="aspect-[4/3] bg-surface flex items-center justify-center mb-6">
                  <span className="text-6xl font-light text-text-tertiary">{project.image}</span>
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-text-secondary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="stack" className="py-24">
          <SectionHeader 
            title="Technologies" 
            subtitle="Tools and technologies I use to bring ideas to life."
          />
          
          <Card className="p-8">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {techStack.map((tech, index) => (
                <div
                  key={tech}
                  className="aspect-square flex items-center justify-center rounded-lg bg-surface border border-border-light text-sm font-mono font-medium hover:bg-surface-hover hover:border-border transition-all duration-500 cursor-default"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* GitHub Contributions */}
        <section className="py-24">
          <SectionHeader 
            title="Contributions" 
            subtitle="Active development and open source contributions over the past year."
          />
          
          <Card className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex gap-1 mb-4 font-mono text-xs text-text-tertiary">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <span key={month} className="flex-1 text-center">{month}</span>
                  ))}
                </div>
                <div className="grid grid-cols-[repeat(52,1fr)] gap-1">
                  {contributions.slice(0, 364).map((contrib, index) => {
                    const opacityLevels = ['0.15', '0.3', '0.5', '0.75', '1'];
                    return (
                      <div
                        key={index}
                        className="aspect-square rounded-[3px] bg-foreground transition-all duration-300 hover:scale-125 hover:z-10"
                        style={{ 
                          opacity: opacityLevels[contrib.level],
                        }}
                        title={`${contrib.count} contributions on ${contrib.date}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6 text-sm font-mono text-text-tertiary">
              <span>Less</span>
              <div className="flex gap-1">
                {[0.15, 0.3, 0.5, 0.75, 1].map((opacity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-[3px] bg-foreground"
                    style={{ opacity }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </Card>
        </section>

        {/* Writing Section */}
        <section id="writing" className="py-24">
          <SectionHeader 
            title="Writing" 
            subtitle="Thoughts, insights, and learnings from my journey in technology."
          />
          
          <div className="space-y-4">
            {blogPosts.map((post, index) => (
              <Card key={index} delay={index * 100} className="group p-6 md:p-8">
                <a href="#" className="block">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-text-secondary transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">{post.description}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-mono text-text-tertiary">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="secondary" size="lg">
              View All Posts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Button>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24">
          <SectionHeader 
            title="Get in Touch" 
            subtitle="Have a project in mind or want to collaborate? I'd love to hear from you."
            align="center"
          />
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card delay={100} className="p-6 text-center group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border-light flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:hello@subway.dev" className="text-text-secondary hover:text-foreground transition-colors">
                hello@subway.dev
              </a>
            </Card>
            
            <Card delay={200} className="p-6 text-center group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border-light flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-text-secondary">Remote / Worldwide</p>
            </Card>
            
            <Card delay={300} className="p-6 text-center group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border-light flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Discord</h3>
              <p className="text-text-secondary">@subway_dev</p>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-semibold text-sm">
                S
              </div>
              <span className="font-semibold">Subway</span>
            </div>
            
            <p className="text-sm text-text-tertiary font-mono">
              © {new Date().getFullYear()} Subway. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <a href="https://github.com/subway" target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-foreground transition-colors duration-300">
                <span className="sr-only">GitHub</span>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a href="https://linkedin.com/in/subway" target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-foreground transition-colors duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://twitter.com/subway_dev" target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-foreground transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
