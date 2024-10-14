import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Space } from "@/utils/tablesUtils";

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
  const [isInputVisible, setIsInputVisible] = React.useState(false);
  const handleAddSpace = () => {
    if (newSpaceName.trim()) {
      onAddSpace(newSpaceName.trim());
      setNewSpaceName("");
    }
  };

  return (
    <div className="mb-4">
      <div className="mb-4">
        <Button
          onClick={() => setIsInputVisible(!isInputVisible)}
          className="mr-2"
        >
          {isInputVisible ? "Cancelar" : "Agregar un espacio con mesas"}
        </Button>
        {isInputVisible && (
          <div className="flex items-center mt-2">
            <Input
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              placeholder="Genera un espacio para tus mesas"
              className="mr-2"
            />
            <Button onClick={handleAddSpace} className="mr-2">
              Agregar
            </Button>
          </div>
        )}
      </div>
      {selectedSpace ? (
        <div className="mb-4"> Espacio seleccionado: {selectedSpace}</div>
      ) : (
        <div className="mb-4">No tienes ningun espacio seleccionado</div>
      )}
      <div className="flex flex-wrap gap-2 mb-2">
        {spaces.map((space) => (
          <div key={space.space_id} className="flex items-center">
            <Button
              onClick={() => onSpaceSelect(space.name)}
              variant={selectedSpace === space.name ? "default" : "outline"}
              className="mr-1"
            >
              {space.name}
            </Button>
            <Button
              onClick={() => onDeleteSpace(space.name)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaceSelector;
