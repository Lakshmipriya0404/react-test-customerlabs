import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
const Navbar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <nav className="bg-nav-color pt-4 pb-4 flex items-center">
      <Button variant="ghost" size="icon">
        <ChevronLeft className="text-white" />
      </Button>
      <div className="text-white text-lg font-bold pl-2"> {title} </div>
    </nav>
  );
};

export default Navbar;
