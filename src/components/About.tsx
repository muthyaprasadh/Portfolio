
import { Card } from "@/components/ui/card";
import { User, Heart, Code, TrendingUp } from "lucide-react";

export const About = () => {
  return (
    <section className="py-20 px-6" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Hello! I'm Muthya, a passionate B.Tech CSE student at SRM University-AP. 
                My journey in technology is driven by curiosity and a desire to create 
                meaningful digital experiences that solve real-world problems.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                I specialize in Object-Oriented Programming and Data Structures & Algorithms, 
                with hands-on experience in web development. My passion extends beyond coding 
                to include finance and creative problem-solving approaches.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <Code className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Problem Solver</h3>
                      <p className="text-sm text-gray-600">Love tackling complex challenges</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Creative Mind</h3>
                      <p className="text-sm text-gray-600">Blend creativity with technology</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Team Player</h3>
                      <p className="text-sm text-gray-600">Collaborate effectively</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Finance Enthusiast</h3>
                      <p className="text-sm text-gray-600">Passionate about financial tech</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-400 via-purple-500 to-green-400 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-72 h-72 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/09a05544-1d28-4c45-8302-273a79acdc64.png" 
                    alt="Muthya Prasadh K" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-400 rounded-full animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
