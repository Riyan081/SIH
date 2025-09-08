import { NavLink, useNavigate } from "react-router-dom";
import { Home, BookOpen, HelpCircle, FileText, TrendingUp, Shield, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const sidebarItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/modules", icon: BookOpen, label: "Disaster Modules" },
  { href: "/quiz", icon: HelpCircle, label: "Quizzes" },
  { href: "/resources", icon: FileText, label: "Resources" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">SafeEd</span>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.type}</p>
              </div>
            </div>
            {user.type === 'student' && user.rollNo && (
              <p className="text-xs text-muted-foreground mt-2">Roll No: {user.rollNo}</p>
            )}
          </div>
        )}
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-hover",
                  isActive && "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Logout Button */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-foreground border-muted-foreground/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;