import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import heroBg from "@/assets/hero-bg.jpg";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section - Responsive */}
      <div 
        className="relative bg-gradient-hero min-h-[300px] lg:min-h-screen lg:w-1/2 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(220, 70%, 8%, 0.9), rgba(220, 70%, 15%, 0.8), rgba(185, 85%, 25%, 0.7)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex flex-col justify-center px-6 lg:px-12 text-white relative z-10 text-center lg:text-left">
          <div className="max-w-md mx-auto lg:mx-0">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 leading-tight">
              Secure Your AI
              <span className="block text-accent-glow">Communications</span>
            </h1>
            <p className="text-lg lg:text-xl mb-6 lg:mb-8 text-white/90 leading-relaxed">
              Ciphera automatically detects and protects sensitive data in your AI prompts, 
              ensuring privacy while maintaining functionality.
            </p>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-accent-glow rounded-full flex-shrink-0"></div>
                <span className="text-white/90 text-sm lg:text-base">Real-time sensitive data detection</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-accent-glow rounded-full flex-shrink-0"></div>
                <span className="text-white/90 text-sm lg:text-base">Automatic placeholder replacement</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-accent-glow rounded-full flex-shrink-0"></div>
                <span className="text-white/90 text-sm lg:text-base">Complete audit trail and analytics</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 lg:top-20 right-10 lg:right-20 w-16 lg:w-32 h-16 lg:h-32 bg-accent-glow/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 lg:bottom-20 left-10 lg:left-20 w-12 lg:w-24 h-12 lg:h-24 bg-primary-glow/30 rounded-full blur-lg"></div>
      </div>

      {/* Auth Form Section - Responsive */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-background via-background to-accent/5">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm 
              onToggleForm={() => setIsLogin(false)} 
            />
          ) : (
            <RegisterForm 
              onToggleForm={() => setIsLogin(true)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}