
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Github, FileText } from "lucide-react";

export const Contact = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50" id="contact">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Let's Connect
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to collaborate on exciting projects or discuss opportunities? Let's start a conversation!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                Get In Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">muthyaprasadh_kommuru@srmap.edu.in</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">+91 9908657967</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Location</h3>
                  <p className="text-gray-600">SRM University-AP, Andhra Pradesh</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                Connect Online
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 transform hover:scale-105"
                size="lg"
                onClick={() => window.open('https://www.linkedin.com/in/kommuru-muthya-prasadh-292351306/overlay/about-this-profile/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BSyEjZYWdSzKmCMpzuVumEQ%3D%3D', '_blank')}
              >
                <Linkedin className="mr-3 h-5 w-5" />
                Connect on LinkedIn
              </Button>
              
              <Button 
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white transition-all duration-300 transform hover:scale-105"
                size="lg"
                onClick={() => window.open('https://github.com/muthyaprasadh', '_blank')}
              >
                <Github className="mr-3 h-5 w-5" />
                Follow on GitHub
              </Button>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-300 transform hover:scale-105"
                size="lg"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/lovable-uploads/9ea500ea-d7aa-4e89-8c10-69f5d00b54e8.png';
                  link.download = 'Muthya_Prasadh_K_Resume.png';
                  link.click();
                }}
              >
                <FileText className="mr-3 h-5 w-5" />
                Download Resume
              </Button>
              
              <div className="mt-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-2">Currently Available</h3>
                <p className="text-gray-600 text-sm">
                  Open to internship opportunities, collaborative projects, and 
                  freelance work in web development and software engineering.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            © 2024 Muthya Prasadh K. Built with React and lots of ☕
          </p>
        </div>
      </div>
    </section>
  );
};
