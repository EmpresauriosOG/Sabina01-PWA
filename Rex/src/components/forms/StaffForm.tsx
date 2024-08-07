import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

//ShadCn
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

//Components
import EmailInput from "./FormFields/EmailInput";
import SelectField from "./FormFields/SelectField";
import GenericInput from "./FormFields/GenericInput";

//Utils
import { modifyStaff, submitStaff } from "@/utils/staffUtils";
import { Roles } from "@/hooks/tanstack/getUser";
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import { Staff } from "../Staff/constants";

const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Email must be a Gmail address",
    }),
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  role: z.string(),
});

type FormFields = z.infer<typeof FormSchema>;
interface StaffFormProps {
  location_id?: string;
  restaurant_id?: string;
  isModify?: boolean;
  staffToModify?: Staff;
}

export function StaffForm(props: StaffFormProps) {
  const { location_id, restaurant_id, isModify, staffToModify } = props;
  const { toast } = useToast();
  const form = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: staffToModify?.email || "@gmail.com",
      first_name: staffToModify?.first_name || "",
      last_name: staffToModify?.last_name || "",
      role: staffToModify?.roles[0] || "",
    },
  });

  const onSubmit = async () => {
    // Handle form submission logic here
    try {
      const staff = {
        first_name: form.getValues().first_name,
        last_name: form.getValues().last_name,
        email: form.getValues().email,
        location_id: location_id || "",
        restaurant_id: restaurant_id || "",
        roles: [form.getValues().role] as Roles[],
      };
      await submitStaff(staff).then(() => {
        toast({
          description: `${staff.first_name} agregado.`,
        });
        form.reset();
      });
      useFormSubmissionStore.getState().setStaffFormSubmitted(true);
    } catch (err) {
      console.log("Error adding staff:");
      form.setError("root", {
        message: "Error dando de alta un nuevo usuario.",
      });
    }
  };

  //ToDO: Remove this to a utils file
  const onSubmitModify = async () => {
    // Handle form submission logic here
    const staff = {
      first_name: form.getValues().first_name,
      last_name: form.getValues().last_name,
      email: form.getValues().email,
      location_id: location_id || "",
      restaurant_id: restaurant_id || "",
      roles: [form.getValues().role] as Roles[],
    };
    await modifyStaff(staff)
      .then(() => {
        toast({
          description: `${staff.email} Modificado.`,
        });
        useFormSubmissionStore.getState().setStaffFormSubmitted(true);
      })
      .catch((error) => {
        console.log("Error modificando al staff:", error);
        form.setError("root", {
          message: "Error modificando staff",
        });
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          isModify
            ? form.handleSubmit(onSubmitModify)
            : form.handleSubmit(onSubmit)
        }
        className="w-2/3 space-y-6"
      >
        <GenericInput
          form={form}
          name="first_name"
          placeholder="Nombre"
          formLabel="Nombre"
          formDescription="Nombre del usuario"
        />

        <GenericInput
          form={form}
          name="last_name"
          placeholder="Apellido"
          formLabel="Apellido"
          formDescription="Apellido del usuario"
        />
        <EmailInput
          form={form}
          formLabel="Email"
          formDescription="correo electronico"
        />
        <SelectField
          form={form}
          formLabel="Rol"
          formDescription="Selecciona el rol del usuario"
          selectItems={[Roles.admin, Roles.manager, Roles.staff, Roles.waiter]}
          name="role"
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
