import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface GenericInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  placeholder: string;
  formLabel: string;
  formDescription: string;
  isNumber?: boolean;
}

const GenericInput = (props: GenericInputProps) => {
  const { form, name, placeholder, formLabel, formDescription } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            {props.isNumber ? (
              <Input placeholder={placeholder} {...field} type="number" />
            ) : (
              <Input placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormDescription>{formDescription}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GenericInput;
