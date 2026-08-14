import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, EyeOff, ArrowRight, Zap, Github, User, KeyRound } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BackgroundRipple } from '@/components/ui/background-ripple';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try to login first
      try {
        await login(alias, password);
        navigate(`/${alias}`);
      } catch (loginError: any) {
        // If login fails, auto-register the user
        if (loginError.message.includes('not found') || loginError.message.includes('Invalid')) {
          await register(alias, password);
          toast({
            title: 'Welcome!',
            description: 'Your secure notepad has been created.',
          });
          navigate(`/${alias}`);
        } else {
          throw loginError;
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <BackgroundRipple className="opacity-20" duration={200} />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Enhanced Navbar with Logo */}
      <nav className="border-b border-border/20 backdrop-blur-2xl bg-background/40 relative z-10 sticky top-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Cryptora" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-tight">
              Cryptora
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/divinixx/Cryptora" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-white/80 hover:text-white"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          
          {/* Hero Section with Integrated Login Form */}
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            
            {/* Left Side - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>Instant & Secure Access</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <EncryptedText text="Your Notes" className="block text-white" duration={1500} />
                <span className="block text-primary mt-2">Truly Private</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                End to End Encryption protects your notes. Your password never leaves your device. 
                Simple, fast, and truly secure.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Zero-Knowledge</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                  <EyeOff className="w-4 h-4 text-primary" />
                  <span>Private by Default</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right Side - Login Form (Primary Focus) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-2xl opacity-50 animate-pulse" />
              <div className="relative backdrop-blur-2xl bg-card/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Start Writing Securely
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      No sign-up needed. Just enter and go.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2 text-white/90">
                        <User className="w-4 h-4 text-primary" />
                        Your Alias
                      </label>
                      <Input
                        type="text"
                        placeholder="choose-your-name"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        required
                        disabled={loading}
                        className="h-13 bg-white/5 backdrop-blur-sm border-white/10 focus:border-primary focus:ring-primary/20 transition-all text-white placeholder:text-white/30"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2 text-white/90">
                        <KeyRound className="w-4 h-4 text-primary" />
                        Master Password
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={4}
                        disabled={loading}
                        className="h-13 bg-white/5 backdrop-blur-sm border-white/10 focus:border-primary focus:ring-primary/20 transition-all text-white placeholder:text-white/30"
                      />
                      <p className="text-xs text-white/50 flex items-start gap-2">
                        <Shield className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                        <span>This encrypts your notes. Keep it safe!</span>
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 text-base font-semibold shadow-2xl shadow-primary/40 relative overflow-hidden group bg-primary hover:bg-primary/90" 
                      disabled={loading}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Encrypting...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Access Now
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </span>
                    </Button>
                  </form>

                  <div className="text-center pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50">
                      New here? We'll create your secure notepad automatically.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              { icon: Zap, title: 'Instant Access', desc: 'No registration forms or email verification. Just pick an alias and start writing immediately.' },
              { icon: Shield, title: 'Zero-Knowledge', desc: 'Your encryption key never touches our servers. We literally cannot read or access your notes.' },
              { icon: EyeOff, title: 'Private by Default', desc: 'No tracking, no analytics, no data collection. Your privacy is not negotiable to us.' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl space-y-4 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>

      <footer className="border-t border-white/10 py-6 backdrop-blur-xl bg-background/50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Cryptora" className="w-6 h-6" />
              <p className="text-sm text-white/50">
                Cryptora © 2025 - Your privacy, our priority
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <a href="https://github.com/divinixx/Cryptora" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" />
                Open Source
              </a>
              <span>•</span>
              <span>Zero-Knowledge</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
