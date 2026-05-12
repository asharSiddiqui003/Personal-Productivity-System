import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiCalendar, FiArrowRight, FiMessageSquare, FiX, FiMail, FiCheck, FiLayout, FiLayers } from "react-icons/fi";
import logo from "./assets/logo.png";

const Introduction = () => {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1123] text-[#F1E9E9] overflow-x-hidden font-sans relative">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#982598] rounded-full mix-blend-screen filter blur-[128px] opacity-30 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 z-0"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img src={logo} alt="Floworg Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-black tracking-widest text-white uppercase">Floworg</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 rounded-xl font-bold bg-[#2a2c5b]/50 border border-[#982598]/30 hover:bg-[#982598] hover:border-transparent transition-all duration-300 backdrop-blur-md shadow-lg"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2c5b]/50 border border-[#982598]/30 text-[#B8AED4] text-sm font-semibold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#982598] animate-pulse"></span>
            Version 2.0 is now live
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl lg:text-[5rem] font-black leading-[1.1] mb-6"
          >
            Master Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#982598] to-indigo-400">
              Productivity.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#B8AED4] mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
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
              className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#982598] to-[#ab3fb6] hover:scale-105 transition-transform shadow-xl shadow-purple-500/25"
            >
              Get Started Free <FiArrowRight size={24} />
            </button>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 rounded-2xl font-bold text-lg bg-[#2a2c5b]/30 border border-[#2a2c5b] hover:bg-[#2a2c5b]/60 transition-colors backdrop-blur-md"
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
          <div className="absolute inset-0 bg-gradient-to-tr from-[#982598]/30 to-transparent rounded-[3rem] blur-3xl"></div>
          <div className="relative bg-[#15173D]/90 border border-[#2a2c5b] rounded-[3rem] p-8 shadow-2xl backdrop-blur-xl flex flex-col gap-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="h-6 w-24 bg-[#2a2c5b] rounded-full flex items-center px-2 gap-2">
                <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                <div className="h-2 w-12 bg-[#B8AED4]/30 rounded-full"></div>
              </div>
            </div>
            <div className="h-20 w-full bg-[#1D1F49] rounded-2xl border border-[#2a2c5b]/50 flex items-center px-6 gap-4 transform hover:scale-[1.02] transition-transform">
               <div className="w-6 h-6 rounded-full border-2 border-[#982598]"></div>
               <div className="flex flex-col gap-2 flex-1">
                 <div className="h-3 w-48 bg-[#F1E9E9] rounded-full"></div>
                 <div className="h-2 w-24 bg-[#B8AED4]/50 rounded-full"></div>
               </div>
               <div className="h-8 w-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                 <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
               </div>
            </div>
            <div className="h-16 w-full bg-[#1D1F49] rounded-2xl border border-[#2a2c5b]/50 flex items-center px-6 gap-4 opacity-60">
               <div className="w-6 h-6 rounded-full bg-[#982598] flex items-center justify-center">
                 <FiCheckCircle size={14} className="text-white" />
               </div>
               <div className="h-3 w-32 bg-[#B8AED4] rounded-full line-through"></div>
            </div>
            <div className="mt-2 relative overflow-hidden bg-gradient-to-br from-[#2a2c5b] to-[#15173D] border border-[#982598]/30 h-40 rounded-[2rem] flex items-center justify-between p-8 shadow-inner">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#982598] rounded-full blur-2xl opacity-20"></div>
               <div className="flex flex-col gap-2 z-10">
                 <span className="text-[#B8AED4] font-bold tracking-widest text-sm uppercase">Deep Work</span>
                 <span className="text-5xl font-black text-white drop-shadow-lg">25:00</span>
               </div>
               <div className="w-16 h-16 rounded-2xl bg-[#982598] flex items-center justify-center shadow-lg shadow-purple-500/40 z-10">
                 <FiPlay size={24} className="text-white ml-1" />
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 bg-[#1D1F49]/30 border-y border-[#2a2c5b]">
        <div className="max-w-7xl mx-auto px-12 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Everything you need to focus</h2>
            <p className="text-xl text-[#B8AED4] max-w-2xl mx-auto">A seamless blend of productivity tools designed specifically to remove distractions and help you get things done.</p>
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
                className="bg-[#15173D] border border-[#2a2c5b] p-10 rounded-[2rem] hover:bg-[#2a2c5b]/40 hover:border-[#982598]/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-[#2a2c5b] rounded-2xl flex items-center justify-center mb-6 text-[#982598] group-hover:scale-110 group-hover:bg-[#982598] group-hover:text-white transition-all shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-[#B8AED4] leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: How It Works */}
      <section className="max-w-7xl mx-auto px-12 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">How It Works</h2>
          <p className="text-xl text-[#B8AED4] max-w-2xl mx-auto">Get into flow state in three simple steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#982598]/50 to-transparent -translate-y-1/2 z-0"></div>
          
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
              className="relative bg-[#0f1123] border border-[#2a2c5b] p-10 rounded-[2rem] text-center z-10 hover:border-[#982598]/50 transition-colors shadow-xl"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#982598] to-indigo-600 rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/30 text-white">
                {item.step}
              </div>
              <div className="text-[#982598] mb-6 flex justify-center mt-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-[#B8AED4]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW SECTION 3: Dashboard Preview */}
      <section className="bg-[#1D1F49]/30 border-y border-[#2a2c5b] py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16">A workspace you'll love</h2>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl mx-auto bg-[#0f1123] border border-[#2a2c5b] rounded-t-[2rem] md:rounded-[2rem] shadow-[0_0_100px_rgba(152,37,152,0.15)] flex flex-col overflow-hidden h-[500px]"
          >
            <div className="bg-[#15173D] h-12 border-b border-[#2a2c5b] flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex flex-1 p-6 gap-6">
              <div className="w-48 bg-[#15173D] rounded-2xl border border-[#2a2c5b] hidden md:flex flex-col gap-4 p-4">
                 <div className="h-8 bg-[#2a2c5b] rounded-lg"></div>
                 <div className="h-8 bg-[#1D1F49] rounded-lg w-3/4"></div>
                 <div className="h-8 bg-[#1D1F49] rounded-lg w-5/6"></div>
                 <div className="mt-auto h-8 bg-[#1D1F49] rounded-lg"></div>
              </div>
              <div className="flex-1 bg-[#15173D] rounded-2xl border border-[#2a2c5b] flex flex-col p-6 gap-4">
                 <div className="h-10 w-48 bg-[#2a2c5b] rounded-xl mb-4"></div>
                 <div className="h-16 w-full bg-[#1D1F49] rounded-xl flex items-center px-4 gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-[#982598]"></div>
                    <div className="h-4 w-1/2 bg-[#B8AED4]/30 rounded-full"></div>
                 </div>
                 <div className="h-16 w-full bg-[#1D1F49] rounded-xl flex items-center px-4 gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-[#982598]"></div>
                    <div className="h-4 w-1/3 bg-[#B8AED4]/30 rounded-full"></div>
                 </div>
                 <div className="h-16 w-full bg-[#1D1F49] rounded-xl flex items-center px-4 gap-4 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-[#982598]"></div>
                    <div className="h-4 w-1/4 bg-[#B8AED4]/30 rounded-full line-through"></div>
                 </div>
              </div>
              <div className="w-72 bg-[#15173D] rounded-2xl border border-[#2a2c5b] hidden lg:flex flex-col p-6 items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#982598]/10 blur-2xl"></div>
                 <div className="w-48 h-48 rounded-full border-8 border-[#982598]/20 border-t-[#982598] flex items-center justify-center relative z-10 transform -rotate-45">
                    <div className="rotate-45 text-4xl font-black text-white drop-shadow-md">25:00</div>
                 </div>
                 <div className="mt-8 text-[#B8AED4] font-bold uppercase tracking-widest text-sm">Focus Mode</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION 4: Feature Comparison */}
      <section className="max-w-5xl mx-auto px-12 py-24 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Why switch?</h2>
        <div className="bg-[#15173D] border border-[#2a2c5b] rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-2 bg-[#1D1F49] border-b border-[#2a2c5b] p-6 md:p-8 text-xl font-bold">
            <div className="text-[#B8AED4]">Without TaskMaster</div>
            <div className="text-[#982598]">With TaskMaster</div>
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
              className="grid grid-cols-2 border-b border-[#2a2c5b] p-6 md:p-8 last:border-b-0 hover:bg-[#1D1F49]/50 transition-colors"
            >
              <div className="text-[#B8AED4] flex items-center gap-3">
                <FiX className="text-red-400 shrink-0" size={24} /> <span className="text-lg">{row[0]}</span>
              </div>
              <div className="text-white flex items-center gap-3 font-medium">
                <FiCheck className="text-green-400 shrink-0" size={24} /> <span className="text-lg">{row[1]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW SECTION 6: Roadmap */}
      <section className="bg-[#1D1F49]/30 border-y border-[#2a2c5b] py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-12">What's coming next</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-[#15173D] border border-[#982598]/50 p-8 rounded-3xl flex-1 shadow-[0_0_30px_rgba(152,37,152,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#982598]/20 blur-xl rounded-full"></div>
               <div className="text-[#982598] font-bold mb-3 uppercase tracking-widest text-sm flex items-center justify-center gap-2"><FiCheckCircle /> Done</div>
               <div className="text-2xl font-bold">Dark Mode Themes</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-[#15173D] border border-[#2a2c5b] p-8 rounded-3xl flex-1 opacity-90 transition-opacity hover:opacity-100">
               <div className="text-yellow-500 font-bold mb-3 uppercase tracking-widest text-sm flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Soon</div>
               <div className="text-2xl font-bold text-white">Team Sharing</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-[#15173D] border border-[#2a2c5b] p-8 rounded-3xl flex-1 opacity-60 transition-opacity hover:opacity-100">
               <div className="text-gray-400 font-bold mb-3 uppercase tracking-widest text-sm flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full border border-gray-400"></div> Planned</div>
               <div className="text-2xl font-bold text-[#B8AED4]">Mobile App</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 5 & 7: Email Capture & Final CTA Banner */}
      <section className="max-w-4xl mx-auto px-12 py-32 text-center relative z-10">
        <div className="absolute inset-0 bg-[#982598]/10 blur-[100px] rounded-full z-0"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6">Start focusing now. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#982598] to-indigo-400">It's free.</span></h2>
          <p className="text-xl text-[#B8AED4] mb-10">Join thousands of others mastering their productivity.</p>
          
          <div className="flex justify-center mb-16">
            <button 
              onClick={() => navigate('/signup')}
              className="flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#982598] to-[#ab3fb6] hover:scale-105 transition-transform shadow-xl shadow-purple-500/25"
            >
              Get Started <FiArrowRight size={24} />
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#15173D] border border-[#2a2c5b] p-8 md:p-10 rounded-[2rem] max-w-lg mx-auto shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center justify-center gap-2"><FiMail className="text-[#982598]" /> Get early access to new features</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="Enter your email" className="flex-1 bg-[#0f1123] border border-[#2a2c5b] rounded-xl px-4 py-3 focus:outline-none focus:border-[#982598] text-white placeholder-[#B8AED4]/50 transition-colors" />
              <button className="bg-[#2a2c5b] hover:bg-[#982598] text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-purple-500/20">Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION 8: Footer Navigation */}
      <footer className="relative z-10 bg-[#0f1123] border-t border-[#2a2c5b] pt-16 pb-8 px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src={logo} alt="Floworg Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-black tracking-widest text-white uppercase">Floworg</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[#B8AED4] font-medium">
            <a href="#" className="hover:text-white hover:underline decoration-[#982598] decoration-2 underline-offset-4 transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-white hover:underline decoration-[#982598] decoration-2 underline-offset-4 transition-all">Terms of Use</a>
            <a href="#" className="hover:text-white hover:underline decoration-[#982598] decoration-2 underline-offset-4 transition-all">Contact</a>
            <a href="#" className="hover:text-white hover:underline decoration-[#982598] decoration-2 underline-offset-4 transition-all">Blog</a>
          </div>
        </div>
        <div className="text-center text-[#B8AED4]/40 text-sm">
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
              className="absolute bottom-20 right-0 w-[340px] bg-[#15173D] border border-[#2a2c5b] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-6 mb-2 origin-bottom-right"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-white">Send Feedback</h3>
                <button onClick={() => setIsFeedbackOpen(false)} className="text-[#B8AED4] hover:text-white bg-[#2a2c5b]/50 hover:bg-[#2a2c5b] p-2 rounded-lg transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#B8AED4] mb-2">What's working well?</label>
                  <textarea className="w-full bg-[#0f1123] border border-[#2a2c5b] rounded-xl p-3 focus:outline-none focus:border-[#982598] text-white resize-none h-24 placeholder-[#B8AED4]/30 transition-colors" placeholder="I love the..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B8AED4] mb-2">What can we improve?</label>
                  <textarea className="w-full bg-[#0f1123] border border-[#2a2c5b] rounded-xl p-3 focus:outline-none focus:border-[#982598] text-white resize-none h-24 placeholder-[#B8AED4]/30 transition-colors" placeholder="It would be great if..."></textarea>
                </div>
                <button 
                  onClick={() => { alert('Thank you for your feedback! Our team will review it.'); setIsFeedbackOpen(false); }}
                  className="w-full bg-[#982598] hover:bg-[#ab3fb6] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:scale-[1.02]"
                >
                  Submit Feedback
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
          className="w-14 h-14 bg-[#982598] hover:bg-[#ab3fb6] rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 absolute bottom-0 right-0"
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
