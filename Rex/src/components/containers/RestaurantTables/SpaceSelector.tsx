import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Space } from "@/utils/tablesUtils";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface SpaceSelectorProps {
  spaces: Space[];
  selectedSpace: string | null;
  onSpaceSelect: (space: Space) => void;
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
  const { toast } = useToast();
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
          {isInputVisible ? "Cancelar" : "Agrega un espacio"}
        </Button>
        {isInputVisible && (
          <div className="flex flex-col sm:flex-row items-center mt-2">
            <Input
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              placeholder="Genera un espacio para tus mesas"
              className="mr-2 mb-2 sm:mb-0"
            />
            <Button onClick={handleAddSpace} className="mr-2">
              Agregar Espacio
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col shadow-md rounded-md  dark:bg-neutral-900 p-4">
        <h2 className="text-lg font-semibold mb-2 ">Espacios</h2>
        <div className="flex flex-wrap gap-2 pl-2 shadow-md rounded-md  dark:bg-neutral-900">
          {spaces.map((space) => (
            <div key={space.name} className="flex items-center mb-2">
              <Button
                onClick={() => onSpaceSelect(space)}
                variant={selectedSpace === space.name ? "default" : "outline"}
                className="mr-2"
              >
                {space.name}
              </Button>
              <Button
                onClick={() => {
                  toast({
                    variant: "destructive",
                    title: "Estas seguro?",
                    description: space.name + " sera eliminado",
                    action: (
                      <>
                        <ToastAction altText="Cancelar">Cancelar</ToastAction>
                        <ToastAction
                          onClick={() => onDeleteSpace(space.space_id)}
                          altText="Eliminar"
                        >
                          Eliminar
                        </ToastAction>
                      </>
                    ),
                  });
                }}
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
    </div>
  );
};

export default SpaceSelector;
