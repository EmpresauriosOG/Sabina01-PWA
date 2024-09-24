import { StaffForm } from "../forms/StaffForm";
import ModalForm from "./ModalForm";

interface StaffModalProps {
  location_id: string;
  restaurant_id: string;
}
const StaffModal = (props: StaffModalProps) => {
  return (
    <ModalForm
      buttonTitle="Agregar"
      dialogTitle="Completa el formulario"
      dialogDescription="Siempre puedes eliminar / modificar despues"
      form={
        <StaffForm
          location_id={props.location_id}
          restaurant_id={props.restaurant_id}
        />
      }
    />
  );
};

export default StaffModal;
