import { IngredientForm } from "../forms/IngredientForm";
import ModalForm from "./ModalForm";

interface IngredientModalProps {
  location_id: string;
  restaurant_id: string;
}

const IngredientModal = (props: IngredientModalProps) => {
  return (
    <ModalForm
      buttonTitle="Agregar"
      dialogTitle="Completa el formulario"
      dialogDescription="Siempre puedes eliminar / modificar despues"
      form={
        <IngredientForm
          location_id={props.location_id}
          restaurant_id={props.restaurant_id}
          isModify={false}
        />
      }
    />
  );
};

export default IngredientModal;
