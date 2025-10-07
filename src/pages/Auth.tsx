import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import heroBg from "@/assets/hero-bg.jpg";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(220, 70%, 8%, 0.9), rgba(220, 70%, 15%, 0.8), rgba(185, 85%, 25%, 0.7)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex flex-col justify-center px-12 text-white relative z-10">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Secure Your AI
              <span className="block text-accent-glow">Communications</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Ciphera automatically detects and protects sensitive data in your AI prompts, 
              ensuring privacy while maintaining functionality.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-glow rounded-full"></div>
                <span className="text-white/90">Real-time sensitive data detection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-glow rounded-full"></div>
                <span className="text-white/90">Automatic placeholder replacement</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-glow rounded-full"></div>
                <span className="text-white/90">Complete audit trail and analytics</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-accent-glow/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary-glow/30 rounded-full blur-lg"></div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-accent/5">
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