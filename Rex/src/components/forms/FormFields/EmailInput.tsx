import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmailInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  formLabel: string;
  formDescription: string;
}

const EmailInput = (props: EmailInputProps) => {
  const { form, formLabel, formDescription } = props;
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Input placeholder="ejemplo@gmail.com" {...field} />
          </FormControl>
          <FormDescription>{formDescription}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailInput;
