

// version 2
import React from "react";
import { motion } from "framer-motion";
import {useState,useEffect} from "react";
import { Plus,Minus ,ArrowRightIcon,CheckIcon} from "lucide-react";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ShoppingCartIcon,
  StarIcon,
  BoltIcon ,
  CubeTransparentIcon,
  
} from "@heroicons/react/24/outline";
import { useInView } from "react-intersection-observer"
import { useNavigate } from "react-router-dom";
// import { CheckIcon } from "@heroicons/react/24/solid";
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const startCounter = () => {
    if (hasStarted) return;
    setHasStarted(true);
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress >= 1) clearInterval(timer);
    }, 16);
  };

  return [count, startCounter];
}



function Nav() {
   const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SellSphere
            </span>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"  onClick={() => navigate("/login")} >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  return (
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
  {/* Animated background elements */}
  <div className="absolute inset-0">
    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
  </div>

  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6 sm:px-12 max-w-7xl mx-auto pt-20">
    
    {/* Left Text Content */}
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1 }}
    className="text-left animate-fade-up">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight">
        <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Transform Your
        </span>
        <br />
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          Sales Business
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
        Revolutionize your Sales with AI-powered analytics, automated campaigns, 
        and intelligent inventory management that scales with your success.
      </p>
      <div className="flex flex-col sm:flex-row gap-6">
        <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2" onClick={() => navigate("/login")}>
          <span   >Start Free Trial</span>
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
          Watch Demo
        </button>
      </div>
    </motion.div>

    {/* Right Image with 3D Tilt */}
<motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1 }}
  className="relative flex justify-center pr-4"
>
  <div
    className="
      bg-transparent 
      relative z-20
      w-[80%] lg:w-[600px]
      transform-gpu transition-transform duration-700 ease-out
    "
    style={{
      perspective: "1400px", // depth for 3D
    }}
  >
<motion.img
  src="../../images/dashboard.png"
  alt="Book Stock Pro Dashboard"
  initial={{ rotateY: -15, rotateX: 8, scale: 1 }}   // Tilted along X and Y
  whileHover={{ rotateY: -5, rotateX: 3, scale: 1.05 }} // Smoothly reduces tilt
  transition={{ type: "spring", stiffness: 100, damping: 15 }}
  className="
    w-full h-auto object-contain rounded-2xl shadow-2xl
    transform-gpu
  "
  style={{
    transformStyle: "preserve-3d", // ensures 3D rendering
    perspective: "1000px",         // adds depth
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.25), 0 10px 15px rgba(0,0,0,0.15)", // layered shadow
  }}
/>

  </div>
</motion.div>


  </div>
</section>

  );
}

const features = [
  {
    title: "Campaign Scheduler",
    desc: "Plan, launch, and automate book campaigns effortlessly with intelligent timing.",
    icon: BoltIcon,
    color: "from-orange-500 via-pink-500 to-red-500",
    delay: 0.1
  },
  {
    title: "Inventory Management",
    desc: "Track & update book stock, manage purchases and sales with real-time accuracy.",
    icon: ShoppingCartIcon,
    color: "from-emerald-500 via-teal-500 to-cyan-500",
    delay: 0.2
  },
  {
    title: "Advanced Analytics",
    desc: "Visualize trends with interactive charts for sales, customers, and revenue insights.",
    icon: ChartBarIcon,
    color: "from-purple-500 via-violet-500 to-indigo-500",
    delay: 0.3
  },
  {
    title: "Customer Insight",
    desc: "Store customer details, purchase history, and preferences for personalized experiences.",
    icon: UserGroupIcon,
    color: "from-blue-500 via-sky-500 to-cyan-500",
    delay: 0.4
  },
  {
    title: "Sales Intelligence",
    desc: "Automated data breakdown and predictive analytics for strategic decision making.",
    icon: AcademicCapIcon,
    color: "from-pink-500 via-rose-500 to-orange-500",
    delay: 0.5
  },
  {
    title: "Premium Experience",
    desc: "Beautiful, smooth, and interactive user interface with seamless animations.",
    icon: StarIcon,
    color: "from-yellow-500 via-amber-500 to-orange-500",
    delay: 0.6
  },
];

 
function FeaturesSection() {
  return (
    <section className="relative px-6 sm:px-8 py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage, analyze, and grow your book business in one intelligent platform
          </p>
        </div>

        {/* Consistent grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ title, desc, icon: Icon, color, delay }, idx) => {
            const [ref, inView] = useInView();
            
            return (
              <div
                key={idx}
                ref={ref}
                className={`
                  relative group cursor-pointer
                  transform transition-all duration-700 ease-out
                  ${inView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-16'
                  }
                `}
                style={{ transitionDelay: `${delay}s` }}
              >
                <div className="relative h-64 bg-white rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-100/50 group-hover:border-white group-hover:-translate-y-2 flex flex-col justify-between">
                  {/* Floating 3D icon */}
                  <div className={`
                    absolute -top-6 left-8 w-12 h-12 rounded-2xl 
                    bg-gradient-to-br ${color} 
                    flex items-center justify-center shadow-xl
                    transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500
                    before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:${color} before:blur-lg before:opacity-50 before:-z-10
                  `}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Hover glow effect */}
                  <div className={`
                    absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 
                    bg-gradient-to-br ${color} transition-opacity duration-500 pointer-events-none
                  `}></div>

                  <div className="mt-8">
                    <h3 className="font-bold text-xl mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function BenefitItem({ text, delay }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div
      ref={ref}
      className={`
        flex items-start space-x-4 transform transition-all duration-700 ease-out
        ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mt-1">
        <CheckIcon className="w-4 h-4 text-white" />
      </div>
      <p className="text-gray-200 text-lg leading-relaxed">{text}</p>
    </div>
  );
}

function AboutSection() {
  const benefits = [
    "Increase sales by 25% with intelligent automation",
    "Reduce inventory costs through predictive analytics", 
    "Enhance customer satisfaction with personalized experiences",
    "Save 10+ hours weekly with automated reporting"
  ];

  return (
    <section className="px-6 sm:px-8 py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 text-gray-900 leading-tight">
                Why Choose 
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Book Stock Pro?
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your bookstore into a data-driven powerhouse with our comprehensive platform designed for modern book retailers.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, idx) => {
                const [ref, inView] = useInView();
                return (
                  <div
                    key={idx}
                    ref={ref}
                    className={`
                      flex items-start space-x-4 transform transition-all duration-700 ease-out
                      ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                    `}
                    style={{ transitionDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mt-1 shadow-lg">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed font-medium">{benefit}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Revenue Growth", value: "+127%", color: "from-green-500 to-emerald-600" },
                  { label: "Time Saved", value: "15hrs/wk", color: "from-blue-500 to-cyan-600" },
                  { label: "Customer Satisfaction", value: "98%", color: "from-purple-500 to-pink-600" },
                  { label: "Inventory Accuracy", value: "99.9%", color: "from-orange-500 to-red-600" }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center space-y-2 p-4 bg-gray-50/50 rounded-2xl">
                    <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedStats() {
  const stats = [
    { label: "Total Revenue", value: 50000, prefix: "₹", suffix: "+" },
    { label: "Products Sold", value: 2500, prefix: "", suffix: "+" },
    { label: "Active Users", value: 850, prefix: "", suffix: "+" },
    { label: "Success Rate", value: 99, prefix: "", suffix: "%" },
  ];

  return (
    <section className="relative px-6 sm:px-8 py-32 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
          Trusted by Worldwide Retailers
        </h2>
        <p className="text-xl text-white/80 mb-16 max-w-2xl mx-auto">
          Join thousands of successful retailers who have transformed their business with our platform
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const [count, startCounter] = useCounter(stat.value, 2500);
            const [ref, inView] = useInView();

            React.useEffect(() => {
              if (inView) startCounter();
            }, [inView, startCounter]);

            return (
              <div
                key={stat.label}
                ref={ref}
                className={`
                  transform transition-all duration-700 ease-out
                  ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                `}
                style={{ transitionDelay: `${idx * 0.2}s` }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                    {stat.prefix}{count.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
const faqs = [
  {
    question: "Who can use this platform?",
    answer: "Anyone! Whether you're a freelance salesperson, a solo entrepreneur, or managing a growing business, our platform adapts to your needs. You can track your sales, manage inventory, and monitor performance—all in one place."
  },
  {
    question: "How secure is my sales and customer data?",
    answer: "We take security seriously. All data is protected with bank-level encryption, secure cloud hosting, and regular audits. Your sales, inventory, and customer details are private and never shared with third parties."
  },
  {
    question: "Can I schedule and automate campaigns?",
    answer: "Yes! You can create and schedule personalized sales campaigns based on your inventory, customer purchase history, or seasonal goals. Campaigns can be automated, paused, or rescheduled at any time to match your strategy."
  },
  {
    question: "What kind of analytics and reports are available?",
    answer: "You get real-time insights into sales, revenue, customer trends, and inventory performance. Create custom dashboards, generate detailed reports, and even forecast your sales growth. All reports can be exported for easy sharing."
  },
  {
    question: "Do you offer training and customer support?",
    answer: "Absolutely. We provide 24/7 support via chat, email, and phone. Plus, new users get step-by-step onboarding, tutorials, and ongoing training resources to make the most out of the platform."
  }
];



  return (
    <section className="px-6 sm:px-8 py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Book Stock Pro
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const [ref, inView] = useInView();
            
            return (
              <div
                key={idx}
                ref={ref}
                className={`
                  transform transition-all duration-700 ease-out
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors duration-200 group"
                  >
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {faq.question}
                    </span>
                    <div className={`
                      w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 
                      flex items-center justify-center transform transition-all duration-300
                      ${isOpen ? 'rotate-180 bg-gradient-to-br from-purple-600 to-pink-600' : 'group-hover:scale-110'}
                    `}>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
                      )}
                    </div>
                  </button>
                  
                  <div className={`
                    overflow-hidden transition-all duration-500 ease-out
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="px-8 pb-6 pt-0">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {

  const navigate = useNavigate();
  return (
    <section className="relative px-6 sm:px-8 py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="space-y-8">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
            Ready to Transform
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Your Success?
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join over 10,000+ freelance salesperson,  solo entrepreneur owners who've revolutionized their business. 
            Start your free trial today and experience the future of book retail management.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <button className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center space-x-3">
              <span  onClick={() => navigate("/login")} >Start Free 14-Day Trial</span>
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            
            <div className="text-center sm:text-left">
              <p className="text-white/80 text-sm">
                No credit card required • Cancel anytime
              </p>
              <p className="text-white/60 text-sm">
                30-day money-back guarantee
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-60">
            {['Enterprise Security', 'GDPR Compliant', '99.9% Uptime', '24/7 Support'].map((badge, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckIcon className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-white/80 text-sm font-medium">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// function FeaturesSection() {
//   return (
//     <section className="relative px-8 bg-gradient-to-br from-white via-purple-50 to-blue-100 pt-40 pb-20">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 mb-16 text-center">
//           Platform Features
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//           {features.map(({ title, desc, icon: Icon, color }, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, y: 60 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: idx * 0.2 }}
//               className="relative rounded-3xl p-7 shadow-xl bg-white flex flex-col items-center text-center hover:shadow-2xl transition-all"
//             >
//               {/* Icon popping out */}
//               <div
//                 className={`absolute -top-8 w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
//               >
//                 <Icon className="w-8 h-8 text-white" />
//               </div>

//               <div className="mt-10"> {/* push content down so icon floats above */}
//                 <h3 className="font-semibold text-xl mb-2 text-gray-900">{title}</h3>
//                 <p className="text-gray-600">{desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


// function AboutSection() {
//   return (
//     <section className="px-8 py-14 bg-gradient-to-tr from-purple-200 via-blue-100 to-green-100 flex flex-col md:flex-row items-center">
//       <div className="md:w-1/2 mb-6 md:mb-0">
//         <motion.h2
//           initial={{ x: -50, opacity: 0 }}
//           whileInView={{ x: 0, opacity: 1 }}
//           viewport={{ once: true }}
//           className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-purple-500 to-blue-500 mb-4"
//         >
//           Why Book Stock Pro?
//         </motion.h2>
//         <ul className="space-y-4 text-lg text-gray-700 font-medium list-disc ml-4">
//           <li>Grow sales with automation and campaign scheduling.</li>
//           <li>Transform raw sales data into actionable info.</li>
//           <li>Make smarter stock and purchase decisions.</li>
//           <li>Enhance customer experience with personalized interactions.</li>
//         </ul>
//       </div>
//       <div className="md:w-1/2 flex justify-center">
//         {/* Example gradient stat box */}
//         <motion.div
//           initial={{ scale: 0.7 }}
//           whileInView={{ scale: 1 }}
//           transition={{ duration: 1 }}
//           viewport={{ once: true }}
//           className="bg-gradient-to-tr from-purple-400 to-green-200 rounded-3xl p-10 shadow-2xl flex flex-col items-center text-white font-bold text-2xl"
//         >
//           <span className="mb-2">+25% Faster Sales</span>
//           <span className="mb-2">99% Inventory Accuracy</span>
//           <span className="mb-2">Customer Happiness↑</span>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// function AnimatedStats() {
//   return (
//     <section className="px-8 py-14 bg-gradient-to-r from-blue-200 to-green-200 flex flex-col items-center">
//       <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">Engage Your Store With Data!</h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//         {[
//           { label: "Total Revenue", value: "₹81" },
//           { label: "Books Sold", value: "9" },
//           { label: "Active Campaigns", value: "4" },
//           { label: "Customers", value: "4" },
//         ].map((stat, i) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: i * 0.1 }}
//             className="bg-white rounded-2xl w-32 h-32 flex flex-col items-center justify-center shadow-lg text-purple-600 font-bold text-2xl border border-purple-200"
//           >
//             {stat.value}
//             <span className="text-xs font-semibold mt-1 text-gray-500">{stat.label}</span>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function DemoSection() {
//   return (
//     <section className="px-8 py-14 relative bg-white flex flex-col items-center">
//       <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-purple-500 to-blue-500 mb-8 text-center">
//         See It In Action
//       </h2>
//       <div className="w-full max-w-4xl bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 rounded-3xl shadow-lg p-8">
//         <div className="flex flex-wrap gap-4 justify-between">
//           {/* Snapshots from your dashboard */}
//           <div className="flex-1 rounded-xl overflow-hidden shadow-lg border">
//             <img src={'../../images/Screenshot-2025-08-21-001944.jpg'} alt="Customer Details" className="object-cover w-full h-full" />
//           </div>
//           <div className="flex-1 rounded-xl overflow-hidden shadow-lg border">
//             <img src={'../../images/Screenshot-2025-08-21-001954.jpg'} alt="Analytics" className="object-cover w-full h-full" />
//           </div>
//           <div className="flex-1 rounded-xl overflow-hidden shadow-lg border">
//             <img src={'../../images/Screenshot-2025-08-21-001727.jpg'} alt="Overview" className="object-cover w-full h-full" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function FAQSection() {
//   return (
//     <section className="px-8 py-14 bg-gradient-to-r from-blue-300 via-white to-purple-200">
//       <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-green-400 mb-8 text-center">FAQs</h2>
//       <div className="max-w-3xl mx-auto space-y-6 leading-relaxed">
//         <div>
//           <span className="font-semibold text-purple-700">Is Book Stock Pro suitable for all sizes of bookstores?</span>
//           <p>Absolutely! Whether you're a boutique seller or enterprise, our platform is designed for flexibility and scale.</p>
//         </div>
//         <div>
//           <span className="font-semibold text-purple-700">How secure is my campaign and customer data?</span>
//           <p>We use industry best practices for data encryption and privacy.</p>
//         </div>
//         <div>
//           <span className="font-semibold text-purple-700">Can I customize campaign schedules?</span>
//           <p>Yes! Easily set, update, and automate your campaign timings.</p>
//         </div>
//       </div>
//     </section>
//   );
// }

// function CTASection() {
//   return (
//     <section className="px-8 py-14 bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 flex flex-col items-center relative">
//       <h2 className="text-3xl text-white font-extrabold mb-4 text-center">Ready to Elevate Your Book Sales?</h2>
//       <button className="bg-white text-gradient-to-r from-purple-400 to-blue-500 font-bold px-10 py-4 rounded-2xl text-2xl drop-shadow-lg shadow hover:scale-105 transition">
//         Try Book Stock Pro Free
//       </button>
//     </section>
//   );
// }

// function Footer() {
//   return (
//     <footer className="bg-gradient-to-r from-purple-700 to-blue-700 text-white text-center py-8">
//       <div className="mb-3 font-semibold">Book Stock Pro</div>
//       <div className="mb-2 text-sm text-gray-200">© 2025 — Sell Smarter, Grow Further</div>
//       <div className="flex justify-center space-x-6 mt-2">
//         <a href="#" className="hover:scale-110 transition"><StarIcon className="w-6 h-6" /></a>
//         <a href="#" className="hover:scale-110 transition"><ChartBarIcon className="w-6 h-6" /></a>
//         <a href="#" className="hover:scale-110 transition"><UserGroupIcon className="w-6 h-6" /></a>
//       </div>
//     </footer>
//   );
// }

function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <BoltIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Book Stock Pro</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering Sales with intelligent automation and data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <div className="space-y-2 text-sm">
              {['Features', 'Pricing', 'API', 'Integrations'].map(link => (
                <div key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(link => (
                <div key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-white font-sans">
        <Nav/>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <AnimatedStats />
      {/* <DemoSection /> */}
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
