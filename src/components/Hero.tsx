
import { Button } from "@/components/ui/button";
import { Download, Mail, ExternalLink } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-6">
            Muthya Prasadh K
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-8">
            "Blending Code with Creativity"
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Aspiring software developer with a passion for problem-solving, creativity, 
            and making impactful digital solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/lovable-uploads/9ea500ea-d7aa-4e89-8c10-69f5d00b54e8.png';
                link.download = 'Muthya_Prasadh_K_Resume.png';
                link.click();
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              onClick={() => scrollToSection('contact')}
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Me
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-300"
              onClick={() => scrollToSection('projects')}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              View Projects
            </Button>
          </div>
        </div>
        
        <div className="mt-16 animate-bounce">
          <div className="w-6 h-6 border-l-2 border-b-2 border-gray-400 transform rotate-[-45deg] mx-auto"></div>
        </div>
      </div>
    </section>
  );
};
