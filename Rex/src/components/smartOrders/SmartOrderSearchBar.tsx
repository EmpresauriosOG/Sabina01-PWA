import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SmartOrderSearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SmartOrderSearchBar = (props: SmartOrderSearchBarProps) => {
  const { searchTerm, setSearchTerm } = props;
  return (
    <div className="relative w-full mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search menu items..."
        className="pl-10 py-2 bg-gray-800 text-white border-gray-700 focus:border-blue-500 rounded-full w-full"
      />
    </div>
  );
};

export default SmartOrderSearchBar;
