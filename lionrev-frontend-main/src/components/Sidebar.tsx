import { 
  LayoutDashboard, 
  Facebook, 
  LineChart, 
  Workflow,
  Settings, 
  Target 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, text: 'Dashboard', link: '/Dashboard' },
  { icon: Facebook, text: 'Facebook Pages', link: '/facebook-pages' },
  { icon: LineChart, text: 'Reports' },
  { icon: Workflow, text: 'Pipeline Data' },
  { icon: Target, text: 'Tracking' },
  { icon: Settings, text: 'Settings' }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    // Set active menu based on current URL
    const currentIndex = menuItems.findIndex(item => item.link === location.pathname);
    if (currentIndex !== -1) {
      setActiveItem(currentIndex);
    }
  }, [location.pathname]);

  const handleNavigation = (item, index) => {
    setActiveItem(index);
    if (item.link) {
      navigate(item.link); // Use React Router navigation
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
            activeItem === index ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => handleNavigation(item, index)}
        >
          <item.icon className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">{item.text}</span>
        </div>
      ))}
    </div>
  );
};
