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
import { submitIngredient, updateIngredient } from "@/utils/ingredientUtils";
//Constants and types
import {
  IngredientTypeOptions,
  UnitTypeOptions,
} from "../containers/Inventory/constants";
import { Ingredient } from "../tables/Ingredients/types";

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
  isModify?: boolean;
  ingredientToModify?: Ingredient;
}

export function IngredientForm(props: IngredientFormProps) {
  const { location_id, restaurant_id, ingredientToModify, isModify } = props;
  const { toast } = useToast();
  const form = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: ingredientToModify?.name || "",
      type: ingredientToModify?.type || "",
      stock: ingredientToModify?.stock.toString() || "0",
      unit: ingredientToModify?.unit || "",
      expiration: ingredientToModify?.expiration.toString() || "0",
    },
  });

  //ToDO: Remove this to a utils file
  const onSubmit = async () => {
    // Handle form submission logic here
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
    await submitIngredient(ingredient)
      .then(() => {
        toast({
          description: `${ingredient.name} agregado.`,
        });
        form.reset();
        useFormSubmissionStore.getState().setIngredientFormSubmitted(true);
      })
      .catch((error) => {
        console.log("Error adding ingredient:", error);
        form.setError("root", {
          message: "Error agregando ingrediente",
        });
      });
  };

  //ToDO: Remove this to a utils file
  const onSubmitModify = async () => {
    // Handle form submission logic here
    const ingredient = {
      name: form.getValues().name,
      type: form.getValues().type,
      unit: form.getValues().unit,
      stock: form.getValues().stock,
      expiration: form.getValues().expiration,
      location_id: location_id || "",
      restaurant_id: restaurant_id || "",
      min_stock: 0,
      id: ingredientToModify?.id || "",
    };
    await updateIngredient(ingredient)
      .then(() => {
        toast({
          description: `${ingredient.name} Modificado.`,
        });
        useFormSubmissionStore.getState().setIngredientFormSubmitted(true);
      })
      .catch((error) => {
        console.log("Error modificando ingrediente:", error);
        form.setError("root", {
          message: "Error modificando ingrediente",
        });
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          isModify
            ? form.handleSubmit(onSubmit)
            : form.handleSubmit(onSubmitModify)
        }
        className="w-2/3 space-y-6"
      >
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
          {form.formState.isSubmitting ? "Agregando..." : "Ok"}
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
