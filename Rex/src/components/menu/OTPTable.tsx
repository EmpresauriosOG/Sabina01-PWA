import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
    name: z.string().min(1, {
        message: "Please enter your name.",
    }),
});

export default function OTPTable() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
            name: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen mx-auto">
            <Card className="flex flex-col justify-center items-center border">
                <CardHeader>
                    <CardTitle>Join Table</CardTitle>
                    <CardDescription className="w-80">
                        Welcome to our restaurant! If you have already been
                        seated, we hope you enjoy your dining experience. If you
                        are still awaiting a table, please feel free to browse
                        our menu at your leisure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-60 space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-center"
                                                placeholder="Isaac Vergara"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is the display name for your
                                            bill.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormLabel>Table Code</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Enter the table code provided by
                                            your waiter.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="w-full" type="submit">
                                Join
                            </Button>
                        </form>
                    </Form>
                    <Separator className="my-8" />
                    <Link to="/menu/idRestaurant">
                        <Button className="w-full" type="submit">
                            Menu
                        </Button>
                    </Link>
                </CardContent>
                <CardFooter>
                    <p className="text-muted-foreground">Powered By Bite</p>
                </CardFooter>
            </Card>
            <Toaster />
        </div>
    );
}
