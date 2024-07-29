import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";

//ShadCn
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

//Components
import SelectField from "./FormFields/SelectField";
import GenericInput from "./FormFields/GenericInput";

//Utils
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import { submitIngredient } from "@/utils/ingredientUtils";
import {
  IngredientTypeOptions,
  UnitTypeOptions,
} from "../containers/Inventory/constants";

const FormSchema = z.object({
  name: z.string().refine((name) => name.length >= 3, {
    message: "Name should be at least 3 characters long",
  }),
  type: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  stock: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Expiration must be a valid number",
  }),
  unit: z.string(),
  expiration: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Expiration must be a valid number",
  }),
});

type FormFields = z.infer<typeof FormSchema>;
interface IngredientFormProps {
  location_id?: string;
  restaurant_id?: string;
}

export function IngredientForm(props: IngredientFormProps) {
  const { location_id, restaurant_id } = props;
  const { toast } = useToast();
  const form = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: "",
      stock: "0",
      unit: "",
      expiration: "0",
    },
  });

  const onSubmit = async () => {
    // Handle form submission logic here
    try {
      const ingredient = {
        name: form.getValues().name,
        type: form.getValues().type,
        unit: form.getValues().unit,
        stock: form.getValues().stock,
        expiration: form.getValues().expiration,
        location_id: location_id || "",
        restaurant_id: restaurant_id || "",
        min_stock: 0,
      };
      await submitIngredient(ingredient).then(() => {
        toast({
          description: `${ingredient.name} agregado.`,
        });
        form.reset();
        useFormSubmissionStore.getState().setIngredientFormSubmitted(true);
      });
    } catch (err) {
      console.log("Error adding ingredient:");
      form.setError("root", {
        message: "Error agregando ingrediente",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <GenericInput
          form={form}
          name="name"
          placeholder=""
          formLabel="Nombre"
          formDescription="Nombre del ingrediente"
        />

        <SelectField
          form={form}
          formLabel="Tipo"
          formDescription="Tipo de ingrediente"
          selectItems={IngredientTypeOptions}
          name="type"
        />

        <SelectField
          form={form}
          formLabel="Unidad"
          formDescription="unidad de medida"
          selectItems={UnitTypeOptions}
          name="unit"
        />

        <GenericInput
          form={form}
          name="stock"
          placeholder="0"
          formLabel="Stock"
          formDescription="Cantidad de stock"
          isNumber={true}
        />

        <GenericInput
          form={form}
          name="expiration"
          placeholder="0"
          formLabel="Expiración"
          formDescription="Fecha de expiración"
          isNumber={true}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Agregando..." : "Agregar"}
        </Button>
        {form.formState.errors.root && (
          <div className="text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}
      </form>
    </Form>
  );
}
