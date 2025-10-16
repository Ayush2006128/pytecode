import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.error("Installation not available on this device");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success("App installed successfully!");
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const features = [
    { icon: CheckCircle, text: "Works offline" },
    { icon: CheckCircle, text: "Fast and responsive" },
    { icon: CheckCircle, text: "Native app experience" },
    { icon: CheckCircle, text: "Always accessible" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-gradient-primary border border-glass-border/50 shadow-glow animate-float">
              <Smartphone className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Install PyteCode
            </h1>
            <p className="text-lg text-muted-foreground">
              Get the full app experience on your device
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-glass/20 backdrop-blur-glass border border-glass-border/30 shadow-glass"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          {isInstallable ? (
            <Button 
              onClick={handleInstall}
              size="lg"
              className="w-full shadow-glow hover:shadow-glow/70 transition-all"
            >
              <Download className="w-5 h-5" />
              Install PyteCode
            </Button>
          ) : (
            <div className="p-6 rounded-2xl bg-gradient-primary backdrop-blur-glass border border-glass-border/30 shadow-glass">
              <h3 className="font-semibold mb-2 text-foreground">Manual Installation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                On most browsers, you can install this app by:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Chrome/Edge:</strong> Click the install icon in the address bar</li>
                <li>• <strong>Safari (iOS):</strong> Tap Share → Add to Home Screen</li>
                <li>• <strong>Firefox:</strong> Tap Menu → Install</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Install;
