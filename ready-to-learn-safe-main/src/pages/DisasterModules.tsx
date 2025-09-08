import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { Zap, Waves, Flame, Wind, Shield } from "lucide-react";

const disasterTypes = [
  {
    id: "earthquake",
    title: "Earthquake",
    description: "Learn how to prepare for and respond to earthquakes",
    icon: Zap,
    color: "primary",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    id: "flood",
    title: "Flood",
    description: "Understand flood safety and evacuation procedures",
    icon: Waves,
    color: "accent", 
    gradient: "from-accent/20 to-accent/5"
  },
  {
    id: "fire",
    title: "Fire",
    description: "Master fire safety protocols and escape routes",
    icon: Flame,
    color: "secondary",
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    id: "cyclone",
    title: "Cyclone",
    description: "Prepare for severe weather and wind storms",
    icon: Wind,
    color: "primary",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    id: "pandemic",
    title: "Pandemic",
    description: "Health safety measures and prevention protocols",
    icon: Shield,
    color: "accent",
    gradient: "from-accent/20 to-accent/5"
  }
];

const DisasterModules = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Disaster Modules</h1>
            <p className="text-xl text-muted-foreground">Choose a disaster type to learn about safety measures and preparedness</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasterTypes.map((disaster) => (
              <Card 
                key={disaster.id}
                className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group bg-gradient-to-br ${disaster.gradient} border-${disaster.color}/20`}
                onClick={() => navigate(`/modules/${disaster.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-${disaster.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <disaster.icon className={`h-8 w-8 text-${disaster.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {disaster.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{disaster.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">Interactive Module</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div className="w-2 h-2 bg-accent/50 rounded-full"></div>
                      <div className="w-2 h-2 bg-accent/30 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Overview */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Your Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {disasterTypes.map((disaster, index) => (
                  <div key={disaster.id} className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      index < 3 ? `bg-${disaster.color} text-${disaster.color}-foreground` : `bg-${disaster.color}/10 text-${disaster.color}`
                    }`}>
                      <disaster.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">{disaster.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {index < 3 ? "Completed" : "Not Started"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DisasterModules;