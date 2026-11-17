import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiCalendar, FiArrowRight, FiMessageSquare, FiX, FiMail, FiCheck, FiLayout, FiLayers } from "react-icons/fi";
import logo from "./assets/logo.png";

const Introduction = () => {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] overflow-x-hidden font-sans relative">
      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-10 z-0"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-12 h-12 bg-[var(--surface)] border border-[var(--line-card)] rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img src={logo} alt="Floworg Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-black tracking-widest text-[var(--text-strong)] uppercase">Floworg</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 rounded-xl font-bold bg-[var(--surface)] border border-[var(--line-control)] hover:bg-[var(--raised)] text-[var(--text-strong)] transition-all duration-300 shadow-lg"
        >
          Login to Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-12 pt-24 pb-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-tint)] border border-[var(--accent)]/30 text-[var(--accent)] text-sm font-semibold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
            Version 2.0 is now live
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl lg:text-[5rem] font-normal font-heading leading-[1.1] mb-6 text-[var(--text-strong)]"
          >
            Master Your <br/>
            <span className="text-[var(--accent)]">
              Productivity.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            The ultimate dark-themed workspace combining intelligent task management, deep focus pomodoro timers, and calendar synchronization to supercharge your daily workflow.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
          >
            <button 
              onClick={() => navigate('/signup')}
              className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)] transition-transform shadow-xl"
            >
              Get Started Free <FiArrowRight size={24} />
            </button>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 rounded-2xl font-bold text-lg bg-[var(--surface)] border border-[var(--line-control)] text-[var(--text)] hover:bg-[var(--raised)] transition-colors"
            >
              Explore Features
            </button>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none hover:rotate-0 transition-transform duration-500"
        >
          <div className="relative bg-[var(--raised)] border border-[var(--line-card)] rounded-[3rem] p-8 shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--danger)]"></div>
                <div className="w-3 h-3 rounded-full bg-[var(--accent)]"></div>
                <div className="w-3 h-3 rounded-full bg-[var(--line-control)]"></div>
              </div>
              <div className="h-6 w-24 bg-[var(--surface)] rounded-full flex items-center px-2 gap-2">
                <div className="w-4 h-4 rounded-full bg-[var(--accent)]"></div>
                <div className="h-2 w-12 bg-[var(--text-subtle)]/30 rounded-full"></div>
              </div>
            </div>
            <div className="h-20 w-full bg-[var(--surface)] rounded-2xl border border-[var(--line-card)] flex items-center px-6 gap-4 transform hover:scale-[1.02] transition-transform">
               <div className="w-6 h-6 rounded-full border-2 border-[var(--accent)]"></div>
               <div className="flex flex-col gap-2 flex-1">
                 <div className="h-3 w-48 bg-[var(--text-strong)] rounded-full"></div>
                 <div className="h-2 w-24 bg-[var(--text-muted)]/50 rounded-full"></div>
               </div>
               <div className="h-8 w-8 bg-[var(--danger)]/20 border border-[var(--danger)]/30 rounded-lg flex items-center justify-center">
                 <div className="w-3 h-3 bg-[var(--danger)] rounded-sm"></div>
               </div>
            </div>
            <div className="h-16 w-full bg-[var(--surface)] rounded-2xl border border-[var(--line-card)] flex items-center px-6 gap-4 opacity-60">
               <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
                 <FiCheckCircle size={14} className="text-[var(--on-accent)]" />
               </div>
               <div className="h-3 w-32 bg-[var(--text-muted)] rounded-full line-through"></div>
            </div>
            <div className="mt-2 relative overflow-hidden bg-[var(--surface)] border border-[var(--line-card)] h-40 rounded-[2rem] flex items-center justify-between p-8 shadow-inner">
               <div className="flex flex-col gap-2 z-10">
                 <span className="text-[var(--text-subtle)] font-bold tracking-widest text-sm uppercase">Deep Work</span>
                 <span className="text-5xl font-mono tabular-nums font-black text-[var(--text-strong)] drop-shadow-lg">25:00</span>
               </div>
               <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-lg z-10">
                 <FiPlay size={24} className="text-[var(--on-accent)] ml-1" />
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 bg-[var(--surface)] border-y border-[var(--line-card)]">
        <div className="max-w-7xl mx-auto px-12 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal font-heading text-[var(--text-strong)] mb-6">Everything you need to focus</h2>
            <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">A seamless blend of productivity tools designed specifically to remove distractions and help you get things done.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FiCheckCircle size={32} />, title: "Smart Task Management", desc: "Organize your life with intelligent priority sorting and seamless daily tracking." },
              { icon: <FiClock size={32} />, title: "Deep Focus Pomodoro", desc: "Integrated Pomodoro timer with customizable breaks, intuitive editing, and beautiful visual rings." },
              { icon: <FiCalendar size={32} />, title: "Calendar Syncing", desc: "View your entire week at a glance. All your tasks mapped directly to your schedule automatically." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-[var(--raised)] border border-[var(--line-card)] p-10 rounded-[2rem] hover:border-[var(--accent)]/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-[var(--surface)] rounded-2xl flex items-center justify-center mb-6 text-[var(--accent)] group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)] transition-all shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--text-strong)]">{feature.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: How It Works */}
      <section className="max-w-7xl mx-auto px-12 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal font-heading text-[var(--text-strong)] mb-6">How It Works</h2>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">Get into flow state in three simple steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-[var(--line)] -translate-y-1/2 z-0"></div>
          
          {[
            { step: "1", title: "Add your tasks", desc: "Dump everything out of your brain and into our smart list.", icon: <FiLayers size={32} /> },
            { step: "2", title: "Start Pomodoro", desc: "Pick a task, hit play, and focus completely for 25 minutes.", icon: <FiClock size={32} /> },
            { step: "3", title: "Track Calendar", desc: "See your completed blocks automatically sync to your schedule.", icon: <FiCalendar size={32} /> }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative bg-[var(--raised)] border border-[var(--line-card)] p-10 rounded-[2rem] text-center z-10 hover:border-[var(--accent)]/50 transition-colors shadow-xl"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[var(--accent)] text-[var(--on-accent)] rounded-full flex items-center justify-center font-mono tabular-nums font-black text-xl shadow-lg">
                {item.step}
              </div>
              <div className="text-[var(--accent)] mb-6 flex justify-center mt-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-strong)]">{item.title}</h3>
              <p className="text-[var(--text-muted)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW SECTION 3: Dashboard Preview */}
      <section className="bg-[var(--surface)] border-y border-[var(--line-card)] py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-normal font-heading text-[var(--text-strong)] mb-16">A workspace you'll love</h2>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl mx-auto bg-[var(--bg-canvas)] border border-[var(--line-card)] rounded-t-[2rem] md:rounded-[2rem] flex flex-col overflow-hidden h-[500px]"
          >
            <div className="bg-[var(--surface)] h-12 border-b border-[var(--line-card)] flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--danger)]"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--accent)]"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--line-control)]"></div>
            </div>
            <div className="flex flex-1 p-6 gap-6">
              <div className="w-48 bg-[var(--surface)] rounded-2xl border border-[var(--line-card)] hidden md:flex flex-col gap-4 p-4">
                 <div className="h-8 bg-[var(--raised)] rounded-lg"></div>
                 <div className="h-8 bg-[var(--raised)] rounded-lg w-3/4"></div>
                 <div className="h-8 bg-[var(--raised)] rounded-lg w-5/6"></div>
                 <div className="mt-auto h-8 bg-[var(--raised)] rounded-lg"></div>
              </div>
              <div className="flex-1 bg-[var(--surface)] rounded-2xl border border-[var(--line-card)] flex flex-col p-6 gap-4">
                 <div className="h-10 w-48 bg-[var(--raised)] rounded-xl mb-4"></div>
                 <div className="h-16 w-full bg-[var(--raised)] rounded-xl flex items-center px-4 gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-[var(--accent)]"></div>
                    <div className="h-4 w-1/2 bg-[var(--text-subtle)]/30 rounded-full"></div>
                 </div>
                 <div className="h-16 w-full bg-[var(--raised)] rounded-xl flex items-center px-4 gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-[var(--accent)]"></div>
                    <div className="h-4 w-1/3 bg-[var(--text-subtle)]/30 rounded-full"></div>
                 </div>
                 <div className="h-16 w-full bg-[var(--raised)] rounded-xl flex items-center px-4 gap-4 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent)]"></div>
                    <div className="h-4 w-1/4 bg-[var(--text-subtle)]/30 rounded-full line-through"></div>
                 </div>
              </div>
              <div className="w-72 bg-[var(--surface)] rounded-2xl border border-[var(--line-card)] hidden lg:flex flex-col p-6 items-center justify-center relative overflow-hidden">
                 <div className="w-48 h-48 rounded-full border-8 border-[var(--accent)]/20 border-t-[var(--accent)] flex items-center justify-center relative z-10 transform -rotate-45">
                    <div className="rotate-45 text-4xl font-mono tabular-nums font-black text-[var(--text-strong)] drop-shadow-md">25:00</div>
                 </div>
                 <div className="mt-8 text-[var(--text-muted)] font-bold uppercase tracking-widest text-sm">Focus Mode</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION 4: Feature Comparison */}
      <section className="max-w-5xl mx-auto px-12 py-24 relative z-10">
        <h2 className="text-4xl md:text-5xl font-normal font-heading text-[var(--text-strong)] mb-16 text-center">Why switch?</h2>
        <div className="bg-[var(--raised)] border border-[var(--line-card)] rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-2 bg-[var(--surface)] border-b border-[var(--line-card)] p-6 md:p-8 text-xl font-bold">
            <div className="text-[var(--text-muted)]">Without TaskMaster</div>
            <div className="text-[var(--accent)]">With TaskMaster</div>
          </div>
          {[
            ["Scattered tasks across multiple apps", "Everything organized in one central place"],
            ["Endless distractions and no focus", "Deep focus guided Pomodoro timer"],
            ["Manual calendar blocking", "Automatic smart calendar sync"],
            ["Clunky UI & blinding bright screens", "Premium, distraction-free dark mode"]
          ].map((row, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid grid-cols-2 border-b border-[var(--line-card)] p-6 md:p-8 last:border-b-0 hover:bg-[var(--hover)] transition-colors"
            >
              <div className="text-[var(--text-muted)] flex items-center gap-3">
                <FiX className="text-[var(--danger)] shrink-0" size={24} /> <span className="text-lg">{row[0]}</span>
              </div>
              <div className="text-[var(--text-strong)] flex items-center gap-3 font-medium">
                <FiCheck className="text-[var(--accent)] shrink-0" size={24} /> <span className="text-lg">{row[1]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW SECTION 6: Roadmap */}
      <section className="bg-[var(--surface)] border-y border-[var(--line-card)] py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-normal font-heading text-[var(--text-strong)] mb-12">What's coming next</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-[var(--raised)] border border-[var(--accent)]/50 p-8 rounded-3xl flex-1 relative overflow-hidden">
               <div className="text-[var(--accent)] font-bold mb-3 uppercase tracking-widest text-sm flex items-center justify-center gap-2"><FiCheckCircle /> Done</div>
               <div className="text-2xl font-bold text-[var(--text-strong)]">Dark Mode Themes</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-[var(--raised)] border border-[var(--line-card)] p-8 rounded-3xl flex-1 opacity-90 transition-opacity hover:opacity-100">
               <div className="text-[var(--accent)] font-bold mb-3 uppercase tracking-widest text-sm flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div> Soon</div>
               <div className="text-2xl font-bold text-[var(--text-strong)]">Team Sharing</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-[var(--raised)] border border-[var(--line-card)] p-8 rounded-3xl flex-1 opacity-60 transition-opacity hover:opacity-100">
               <div className="text-[var(--text-subtle)] font-bold mb-3 uppercase tracking-widest text-sm flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full border border-[var(--line-control)]"></div> Planned</div>
               <div className="text-2xl font-bold text-[var(--text-muted)]">Mobile App</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 5 & 7: Email Capture & Final CTA Banner */}
      <section className="max-w-4xl mx-auto px-12 py-32 text-center relative z-10">
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-normal font-heading text-[var(--text-strong)] mb-6">Start focusing now. <br/> <span className="text-[var(--accent)]">It's free.</span></h2>
          <p className="text-xl text-[var(--text-muted)] mb-10">Join thousands of others mastering their productivity.</p>
          
          <div className="flex justify-center mb-16">
            <button 
              onClick={() => navigate('/signup')}
              className="flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)] transition-transform shadow-xl"
            >
              Get Started <FiArrowRight size={24} />
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--raised)] border border-[var(--line-card)] p-8 md:p-10 rounded-[2rem] max-w-lg mx-auto shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center justify-center gap-2 text-[var(--text-strong)]"><FiMail className="text-[var(--accent)]" /> Get early access to new features</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="Enter your email" className="flex-1 bg-[var(--surface)] border border-[var(--line-control)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] text-[var(--text-strong)] placeholder-[var(--text-subtle)] transition-colors" />
              <button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] px-8 py-3 rounded-xl font-bold transition-all">Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION 8: Footer Navigation */}
      <footer className="relative z-10 bg-[var(--bg-canvas)] border-t border-[var(--line-card)] pt-16 pb-8 px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-[var(--surface)] border border-[var(--line-card)] rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src={logo} alt="Floworg Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-black tracking-widest text-[var(--text-strong)] uppercase">Floworg</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[var(--text-muted)] font-medium">
            <a href="#" className="hover:text-[var(--text-strong)] hover:underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--text-strong)] hover:underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-all">Terms of Use</a>
            <a href="#" className="hover:text-[var(--text-strong)] hover:underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-all">Contact</a>
            <a href="#" className="hover:text-[var(--text-strong)] hover:underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-all">Blog</a>
          </div>
        </div>
        <div className="text-center text-[var(--text-subtle)] text-sm">
          <p>© {new Date().getFullYear()} Floworg. Designed for deep productivity.</p>
        </div>
      </footer>

      {/* NEW SECTION 1: User Feedback Widget */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {isFeedbackOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-[340px] bg-[var(--raised)] border border-[var(--line-card)] rounded-2xl shadow-2xl p-6 mb-2 origin-bottom-right"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-[var(--text-strong)]">Send Feedback</h3>
                <button onClick={() => setIsFeedbackOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-strong)] bg-[var(--surface)] p-2 rounded-lg transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-subtle)] mb-2">What's working well?</label>
                  <textarea className="w-full bg-[var(--surface)] border border-[var(--line-control)] rounded-xl p-3 focus:outline-none focus:border-[var(--accent)] text-[var(--text-strong)] resize-none h-24 placeholder-[var(--text-subtle)] transition-colors" placeholder="I love the..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-subtle)] mb-2">What can we improve?</label>
                  <textarea className="w-full bg-[var(--surface)] border border-[var(--line-control)] rounded-xl p-3 focus:outline-none focus:border-[var(--accent)] text-[var(--text-strong)] resize-none h-24 placeholder-[var(--text-subtle)] transition-colors" placeholder="It would be great if..."></textarea>
                </div>
                <button 
                  onClick={() => { alert('Thank you for your feedback! Our team will review it.'); setIsFeedbackOpen(false); }}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] font-bold py-3 rounded-xl transition-all"
                >
                  Submit Feedback
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
          className="w-14 h-14 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-full shadow-lg flex items-center justify-center text-[var(--on-accent)] transition-all hover:scale-110 active:scale-95 absolute bottom-0 right-0"
        >
          {isFeedbackOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
        </button>
      </div>

    </div>
  );
};

// FiPlay Icon component since it wasn't imported from the start
const FiPlay = ({ size, className }) => (
  <svg 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export default Introduction;
