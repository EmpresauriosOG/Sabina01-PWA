import React from "react";
import { Space } from "./RestaurantTables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface SpaceSelectorProps {
  spaces: Space[];
  selectedSpace: string | null;
  onSpaceSelect: (spaceId: string) => void;
  onAddSpace: (name: string) => void;
  onDeleteSpace: (id: string) => void;
}

interface SpaceSelectorProps {
  spaces: Space[];
  selectedSpace: string | null;
  onSpaceSelect: (spaceId: string) => void;
  onAddSpace: (name: string) => void;
  onDeleteSpace: (id: string) => void;
}

const SpaceSelector: React.FC<SpaceSelectorProps> = ({
  spaces,
  selectedSpace,
  onSpaceSelect,
  onAddSpace,
  onDeleteSpace,
}) => {
  const [newSpaceName, setNewSpaceName] = React.useState("");

  const handleAddSpace = () => {
    if (newSpaceName.trim()) {
      onAddSpace(newSpaceName.trim());
      setNewSpaceName("");
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Spaces</h2>
      <div className="flex flex-wrap gap-2 mb-2">
        {spaces.map((space) => (
          <div key={space.id} className="flex items-center">
            <Button
              onClick={() => onSpaceSelect(space.id)}
              variant={selectedSpace === space.id ? "default" : "outline"}
              className="mr-1"
            >
              {space.name}
            </Button>
            <Button
              onClick={() => onDeleteSpace(space.id)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={newSpaceName}
          onChange={(e) => setNewSpaceName(e.target.value)}
          placeholder="Genera un espacio para tus mesas"
        />
        <Button onClick={handleAddSpace}>Add Space</Button>
      </div>
    </div>
  );
};

export default SpaceSelector;
