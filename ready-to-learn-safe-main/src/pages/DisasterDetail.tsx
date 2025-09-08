import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Clock, Users, AlertTriangle, CheckCircle } from "lucide-react";
import earthquakeImage from "@/assets/earthquake-infographic.jpg";
import floodImage from "@/assets/flood-infographic.jpg";

const disasterData = {
  earthquake: {
    title: "Earthquake Safety",
    image: earthquakeImage,
    description: "Earthquakes can strike without warning. Learn essential safety measures to protect yourself and others during seismic events.",
    before: [
      "Create an emergency kit with water, food, and first aid supplies",
      "Identify safe spots in each room (under sturdy tables, away from windows)",
      "Secure heavy furniture and appliances to walls",
      "Develop a family communication plan",
      "Practice 'Drop, Cover, and Hold On' drills regularly"
    ],
    during: [
      "Drop to hands and knees immediately",
      "Take cover under a sturdy desk or table",
      "Hold on to your shelter and protect your head and neck",
      "Stay away from windows, mirrors, and heavy objects",
      "If outdoors, move away from buildings, trees, and power lines"
    ],
    after: [
      "Check for injuries and provide first aid if needed",
      "Inspect your home for damage before re-entering",
      "Be prepared for aftershocks",
      "Stay informed through battery-powered radio",
      "Help others if you are able to do so safely"
    ]
  },
  flood: {
    title: "Flood Safety",
    image: floodImage,
    description: "Floods are among the most common natural disasters. Understanding flood safety can save lives and property.",
    before: [
      "Know your area's flood risk and evacuation routes",
      "Create a flood emergency kit with essentials",
      "Install sump pumps and backup power sources",
      "Keep important documents in waterproof containers",
      "Sign up for local emergency alerts and warnings"
    ],
    during: [
      "Move to higher ground immediately if flooding occurs",
      "Avoid walking or driving through flood waters",
      "Stay away from downed power lines",
      "Listen to emergency broadcasts for updates",
      "If trapped in a building, go to the highest level"
    ],
    after: [
      "Return home only when authorities say it's safe",
      "Avoid flood waters - they may be contaminated",
      "Document damage with photos for insurance",
      "Clean and disinfect everything that got wet",
      "Be aware of mental health impacts and seek help if needed"
    ]
  },
  fire: {
    title: "Fire Safety",
    image: earthquakeImage,
    description: "Fire emergencies require quick thinking and immediate action. Learn how to prevent, escape, and respond to fires.",
    before: [
      "Install smoke detectors and check batteries monthly",
      "Create and practice a home fire escape plan",
      "Keep fire extinguishers in key areas",
      "Maintain heating systems and electrical wiring",
      "Store flammable materials safely"
    ],
    during: [
      "Get out immediately and call 911",
      "Stay low to avoid smoke inhalation",
      "Feel doors before opening - if hot, use alternate route",
      "Never use elevators during a fire",
      "Once out, stay out and meet at designated meeting point"
    ],
    after: [
      "Do not re-enter the building until cleared by fire department",
      "Contact your insurance company to report the fire",
      "Be careful of structural damage",
      "Watch for hot spots that could reignite",
      "Seek help for trauma and stress"
    ]
  },
  cyclone: {
    title: "Cyclone Safety", 
    image: floodImage,
    description: "Cyclones bring strong winds, heavy rains, and flooding. Preparation is key to staying safe during these severe weather events.",
    before: [
      "Monitor weather forecasts and warnings",
      "Prepare an emergency kit with supplies for several days",
      "Secure outdoor furniture and objects that could become projectiles",
      "Know your evacuation zone and routes",
      "Reinforce windows and doors"
    ],
    during: [
      "Stay indoors in the strongest part of the building",
      "Keep away from windows and glass doors",
      "Listen to weather updates on battery-powered radio",
      "Avoid using electrical appliances",
      "Do not go outside during the eye of the storm"
    ],
    after: [
      "Stay indoors until authorities give all-clear",
      "Be careful of downed power lines and debris",
      "Check for gas leaks and structural damage",
      "Help neighbors and community members if safe to do so",
      "Stay informed about recovery resources"
    ]
  },
  pandemic: {
    title: "Pandemic Safety",
    image: earthquakeImage,
    description: "Pandemics require different safety measures focusing on health protocols and social distancing.",
    before: [
      "Stay informed through reliable health sources",
      "Stock up on essential supplies and medications",
      "Maintain good hygiene practices",
      "Get recommended vaccinations",
      "Prepare for possible work/school closures"
    ],
    during: [
      "Follow public health guidelines and restrictions",
      "Practice social distancing and wear masks when required",
      "Wash hands frequently with soap and water",
      "Avoid large gatherings and crowded places",
      "Monitor your health and seek medical care if needed"
    ],
    after: [
      "Continue following health guidelines until officially lifted",
      "Support community recovery efforts",
      "Address mental health impacts",
      "Update emergency plans based on lessons learned",
      "Build resilience for future health emergencies"
    ]
  }
};

const DisasterDetail = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const disaster = type ? disasterData[type as keyof typeof disasterData] : null;

  if (!disaster) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Disaster Type Not Found</h1>
            <Button onClick={() => navigate("/modules")}>Back to Modules</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/modules")}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
            <h1 className="text-4xl font-bold text-foreground">{disaster.title}</h1>
          </div>

          {/* Hero Image and Description */}
          <Card className="mb-8">
            <CardContent className="p-0">
              <img 
                src={disaster.image} 
                alt={`${disaster.title} infographic`}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <p className="text-lg text-muted-foreground">{disaster.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Safety Measures */}
          <div className="grid gap-8">
            {/* Before */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                  <Clock className="h-6 w-6" />
                  Before the {type?.charAt(0).toUpperCase() + type?.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {disaster.before.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* During */}
            <Card className="border-secondary/20 bg-gradient-to-r from-secondary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <AlertTriangle className="h-6 w-6" />
                  During the {type?.charAt(0).toUpperCase() + type?.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {disaster.during.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* After */}
            <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                  <Users className="h-6 w-6" />
                  After the {type?.charAt(0).toUpperCase() + type?.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {disaster.after.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button 
              size="lg"
              onClick={() => navigate("/quiz")}
              className="bg-gradient-to-r from-secondary to-secondary-light text-white"
            >
              Take Quiz on {disaster.title}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/resources")}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              View Resources
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DisasterDetail;