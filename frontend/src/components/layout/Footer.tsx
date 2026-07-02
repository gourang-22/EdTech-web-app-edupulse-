import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';

const footerLinks = {
  Platform: [
    { href: '/courses', label: 'Browse Courses' },
    { href: '/signup', label: 'Become a Student' },
    { href: '/login', label: 'Sign In' },
  ],
  Categories: [
    { href: '/courses?category=Web Development', label: 'Web Development' },
    { href: '/courses?category=Data Science', label: 'Data Science' },
    { href: '/courses?category=Design', label: 'UI/UX Design' },
    { href: '/courses?category=Mobile', label: 'Mobile Development' },
  ],
  Company: [
    { href: '#', label: 'About Us' },
    { href: '#', label: 'Careers' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <span className="text-xl font-bold">Edu<span className="text-violet-600">Pulse</span></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 text-center md:text-left">
              Empowering learners worldwide with cutting-edge courses from industry experts. Start your learning journey today.
            </p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-violet-100 hover:text-violet-600 flex items-center justify-center text-slate-500 transition-all duration-200">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-violet-100 hover:text-violet-600 flex items-center justify-center text-slate-500 transition-all duration-200">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-violet-100 hover:text-violet-600 flex items-center justify-center text-slate-500 transition-all duration-200">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-violet-100 hover:text-violet-600 flex items-center justify-center text-slate-500 transition-all duration-200">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="text-center md:text-left">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-slate-500 hover:text-violet-600 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} EduPulse. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
