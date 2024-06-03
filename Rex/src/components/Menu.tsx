import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { Input } from "@/components/ui/input";
import {
    Search,
    Minus,
    Plus,
    Utensils,
    Salad,
    Ham,
    CakeSlice,
    GlassWater,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenu } from "@/hooks/tanstack/getMenu";
import { useParams } from "react-router-dom";

export default function Menu() {
    const { data, isLoading, isError } = useMenu("665239a9f25b93e429b870bc");

    if (isLoading) {
        <h1>Im cumming</h1>;
    }

    if (isError) {
        <h1>Error</h1>;
    }

    console.log(data);
    const menuData = [
        // Main Course
        {
            category: "Main Course",
            name: "Carne Asada Tacos",
            shortDescription: "Grilled steak tacos with salsa verde",
            longDescription:
                "Grilled marinated steak served on corn tortillas with fresh salsa verde, chopped onions, and cilantro.",
            price: 3.99,
            image: "https://i0.wp.com/www.imbored-letsgo.com/wp-content/uploads/2023/12/Carne-Asada-Street-Tacos-1.jpg?ssl=1",
            ingredients: [
                { name: "Steak", kcal: 200 },
                { name: "Corn Tortillas", kcal: 150 },
                { name: "Salsa Verde", kcal: 30 },
                { name: "Onions", kcal: 20 },
                { name: "Cilantro", kcal: 5 },
            ],
            totalKcals: 405, // Sum of kcal values
        },
        {
            category: "Main Course",
            name: "Al Pastor Tacos",
            shortDescription: "Marinated pork tacos with pineapple",
            longDescription:
                "Thinly sliced marinated pork cooked on a vertical spit, served on corn tortillas with diced pineapple, onions, and cilantro.",
            price: 3.49,
            image: "https://www.publimetro.com.mx/resizer/MQorD77ZUFg0t2PH5HWLbpimC4U=/800x0/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/SRRUMKE2OZFLFOTRC5SBQJUTGA.JPG",
            ingredients: [
                { name: "Pork", kcal: 180 },
                { name: "Corn Tortillas", kcal: 150 },
                { name: "Pineapple", kcal: 40 },
                { name: "Onions", kcal: 20 },
                { name: "Cilantro", kcal: 5 },
            ],
            totalKcals: 395, // Sum of kcal values
        },
        {
            category: "Main Course",
            name: "Carnitas Tacos",
            shortDescription: "Slow-cooked pork tacos with citrus marinade",
            longDescription:
                "Tender, juicy pork shoulder slow-cooked with a tangy citrus marinade, served on corn tortillas with diced onions, cilantro, and lime wedges.",
            price: 3.79,
            image: "https://img.chilango.com/2019/02/tacos-de-carnitas-en-CDMX-social-1.jpeg",
            ingredients: [
                { name: "Pork Shoulder", kcal: 220 },
                { name: "Corn Tortillas", kcal: 150 },
                { name: "Onions", kcal: 20 },
                { name: "Cilantro", kcal: 5 },
                { name: "Lime Wedges", kcal: 10 },
            ],
            totalKcals: 405, // Sum of kcal values
        },
        {
            category: "Main Course",
            name: "Chicken Tinga Tacos",
            shortDescription: "Shredded chicken tacos in smoky chipotle sauce",
            longDescription:
                "Tender shredded chicken cooked in a spicy, smoky chipotle tomato sauce, served on corn tortillas with diced onions, cilantro, and lime wedges.",
            price: 3.59,
            image: "https://images.hola.com/imagenes/cocina/recetas/20230915239258/tacos-tinga-pollo/1-305-963/tinga-pollo-adobe-t.jpg?tx=w_680",
            ingredients: [
                { name: "Chicken Breast", kcal: 180 },
                { name: "Corn Tortillas", kcal: 150 },
                { name: "Chipotle Sauce", kcal: 30 },
                { name: "Onions", kcal: 20 },
                { name: "Cilantro", kcal: 5 },
                { name: "Lime Wedges", kcal: 10 },
            ],
            totalKcals: 395, // Sum of kcal values
        },
        {
            category: "Main Course",
            name: "Barbacoa Tacos",
            shortDescription: "Slow-cooked beef tacos with adobo sauce",
            longDescription:
                "Tender, flavorful beef brisket slow-cooked with adobo sauce and spices, served on corn tortillas with diced onions, cilantro, and lime wedges.",
            price: 4.29,
            image: "https://img.freepik.com/fotos-premium/tacos-barbacoa-estilo-mexicano_872147-11313.jpg",
            ingredients: [
                { name: "Beef Brisket", kcal: 250 },
                { name: "Corn Tortillas", kcal: 150 },
                { name: "Adobo Sauce", kcal: 40 },
                { name: "Onions", kcal: 20 },
                { name: "Cilantro", kcal: 5 },
                { name: "Lime Wedges", kcal: 10 },
            ],
            totalKcals: 475, // Sum of kcal values
        },

        // Appetizers
        {
            category: "Appetizer",
            name: "Guacamole",
            shortDescription: "Fresh avocado dip with chips",
            longDescription:
                "Creamy avocado mashed with lime juice, onions, tomatoes, and cilantro, served with crispy tortilla chips.",
            price: 7.99,
            image: "https://www.simplyrecipes.com/thmb/J4kA2m6jKMgkQwZhG-RYpjZBeFQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Guacamole-LEAD-6-2-64cfcca253c8421dad4e3fad830219f6.jpg",
            ingredients: [
                { name: "Avocado", kcal: 200 },
                { name: "Lime Juice", kcal: 20 },
                { name: "Onions", kcal: 20 },
                { name: "Tomatoes", kcal: 30 },
                { name: "Cilantro", kcal: 5 },
                { name: "Tortilla Chips", kcal: 150 },
            ],
            totalKcals: 425, // Sum of kcal values
        },
        {
            category: "Appetizer",
            name: "Queso Fundido",
            shortDescription: "Melted cheese with chorizo",
            longDescription:
                "Creamy melted cheese with spicy chorizo sausage, served with warm flour tortillas for dipping.",
            price: 8.49,
            image: "https://www.goya.com/media/3942/queso-fundido.jpg?quality=80",
            ingredients: [
                { name: "Cheese", kcal: 150 },
                { name: "Chorizo", kcal: 200 },
                { name: "Flour Tortillas", kcal: 200 },
            ],
            totalKcals: 550, // Sum of kcal values
        },
        {
            category: "Appetizer",
            name: "Chips and Salsa",
            shortDescription: "Fresh tomato salsa with tortilla chips",
            longDescription:
                "Freshly made salsa with ripe tomatoes, onions, jalapenos, and cilantro, served with crispy tortilla chips.",
            price: 4.99,
            image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/12/9/0/FNK_Salsa-and-Chips_s4x3.jpg.rend.hgtvcom.616.462.suffix/1387411410179.jpeg",
            ingredients: [
                { name: "Tomatoes", kcal: 30 },
                { name: "Onions", kcal: 20 },
                { name: "Jalapenos", kcal: 10 },
                { name: "Cilantro", kcal: 5 },
                { name: "Tortilla Chips", kcal: 150 },
            ],
            totalKcals: 215, // Sum of kcal values
        },
        {
            category: "Appetizer",
            name: "Nachos",
            shortDescription: "Loaded nachos with cheese and toppings",
            longDescription:
                "Crispy tortilla chips topped with melted cheese, black beans, jalapenos, tomatoes, onions, and sour cream.",
            price: 9.99,
            image: "https://mojo.generalmills.com/api/public/content/MJYMoQ0lUkezBkK5ql2cSg_gmi_hi_res_jpeg.jpeg?v=c5e8a159&t=16e3ce250f244648bef28c5949fb99ff",
            ingredients: [
                { name: "Tortilla Chips", kcal: 300 },
                { name: "Cheese", kcal: 200 },
                { name: "Black Beans", kcal: 100 },
                { name: "Jalapenos", kcal: 10 },
                { name: "Tomatoes", kcal: 30 },
                { name: "Onions", kcal: 20 },
                { name: "Sour Cream", kcal: 50 },
            ],
            totalKcals: 710, // Sum of kcal values
        },
        {
            category: "Appetizer",
            name: "Taquitos",
            shortDescription: "Crispy rolled tacos with chicken",
            longDescription:
                "Crispy corn tortillas rolled with seasoned shredded chicken, served with guacamole, sour cream, and salsa.",
            price: 6.99,
            image: "https://cheforopeza.com.mx/wp-content/uploads/2017/11/tacos-rib-eye-web.jpg",
            ingredients: [
                { name: "Chicken", kcal: 150 },
                { name: "Corn Tortillas", kcal: 150 },
                { name: "Guacamole", kcal: 200 },
                { name: "Sour Cream", kcal: 100 },
                { name: "Salsa", kcal: 50 },
            ],
            totalKcals: 650, // Sum of kcal values
        },

        // Desserts
        {
            category: "Dessert",
            name: "Tres Leches Cake",
            shortDescription: "Moist sponge cake soaked in three types of milk",
            longDescription:
                "Light and airy sponge cake soaked in a mixture of condensed milk, evaporated milk, and heavy cream, topped with whipped cream and strawberries.",
            price: 6.49,
            image: "https://i.ytimg.com/vi/n0ymEFZJBho/maxresdefault.jpg",
            ingredients: [
                { name: "Flour", kcal: 200 },
                { name: "Sugar", kcal: 100 },
                { name: "Eggs", kcal: 150 },
                { name: "Milk", kcal: 200 },
                { name: "Heavy Cream", kcal: 300 },
                { name: "Strawberries", kcal: 30 },
            ],
            totalKcals: 980, // Sum of kcal values
        },
        {
            category: "Dessert",
            name: "Flan",
            shortDescription: "Creamy caramel custard",
            longDescription:
                "Smooth and silky custard infused with vanilla, topped with rich caramel sauce.",
            price: 4.99,
            image: "https://www.yummytummyaarthi.com/wp-content/uploads/2020/05/flan.jpeg",
            ingredients: [
                { name: "Eggs", kcal: 150 },
                { name: "Milk", kcal: 200 },
                { name: "Sugar", kcal: 100 },
                { name: "Vanilla", kcal: 20 },
                { name: "Caramel Sauce", kcal: 150 },
            ],
            totalKcals: 620, // Sum of kcal values
        },
        {
            category: "Dessert",
            name: "Mexican Hot Chocolate",
            shortDescription: "Rich and creamy hot chocolate with spices",
            longDescription:
                "Warm and comforting hot chocolate made with rich cocoa, cinnamon, and a hint of chili powder, topped with whipped cream.",
            price: 3.99,
            image: "https://mandolina.co/wp-content/uploads/2023/12/Pastel-de-chocolate-y-menta-con-frutos-rojos-1-1200x720.png",
            ingredients: [
                { name: "Cocoa Powder", kcal: 100 },
                { name: "Milk", kcal: 200 },
                { name: "Sugar", kcal: 100 },
                { name: "Cinnamon", kcal: 10 },
                { name: "Chili Powder", kcal: 5 },
                { name: "Whipped Cream", kcal: 50 },
            ],
            totalKcals: 465, // Sum of kcal values
        },
        {
            category: "Dessert",
            name: "Pastel de Elote",
            shortDescription: "Traditional Mexican corn cake",
            longDescription:
                "Sweet and moist cake made with fresh corn, sugar, and butter, flavored with vanilla and a touch of cinnamon.",
            price: 5.49,
            image: "https://lh6.googleusercontent.com/proxy/yR6OoKKEhRgwCwvtfQBc2mp8TAExeuPh1FyuQ1vKKYxx9FoYInINp4LBfb1U4Fh-o8YBtawy7hx0lybL-L75sIsl5siE4aQTCu4ipjjWXqGT8XH_sGlC_CQ-BWxs_E0",
            ingredients: [
                { name: "Corn", kcal: 150 },
                { name: "Sugar", kcal: 100 },
                { name: "Butter", kcal: 200 },
                { name: "Eggs", kcal: 150 },
                { name: "Vanilla", kcal: 20 },
                { name: "Cinnamon", kcal: 10 },
            ],
            totalKcals: 630, // Sum of kcal values
        },
        {
            category: "Dessert",
            name: "Chocoflan",
            shortDescription: "Layered chocolate cake and flan",
            longDescription:
                "Decadent chocolate cake layered with creamy flan, drizzled with caramel sauce.",
            price: 7.99,
            image: "https://www.bettycrocker.lat/mx/wp-content/uploads/sites/2/2020/12/BCmexico-recipe-chocoflan.png",
            ingredients: [
                { name: "Flour", kcal: 200 },
                { name: "Sugar", kcal: 100 },
                { name: "Eggs", kcal: 150 },
                { name: "Milk", kcal: 200 },
                { name: "Cocoa Powder", kcal: 100 },
                { name: "Vanilla", kcal: 20 },
                { name: "Caramel Sauce", kcal: 150 },
            ],
            totalKcals: 920, // Sum of kcal values
        },
        // Drinks
        {
            category: "Drink",
            name: "Jamaica Agua Fresca",
            shortDescription: "Hibiscus flower drink",
            longDescription:
                "A refreshing drink made from dried hibiscus flowers, sugar, and water.",
            price: 2.49,
            image: "https://editorialtelevisa.brightspotcdn.com/dims4/default/dc8e971/2147483647/strip/true/crop/1195x672+3+0/resize/1440x810!/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2021%2F03%2Fcomo-hacer-agua-de-jamaica.jpg",
            ingredients: [
                { name: "Hibiscus Flowers", kcal: 50 },
                { name: "Sugar", kcal: 100 },
                { name: "Water", kcal: 0 },
            ],
            totalKcals: 150, // Sum of kcal values
        },
        {
            category: "Drink",
            name: "Michelada",
            shortDescription: "Beer cocktail with lime and spices",
            longDescription:
                "A refreshing beer cocktail made with beer, lime juice, hot sauce, and spices, served over ice with a salted rim.",
            price: 4.49,
            image: "https://tienda.cristar.com.co/wp-content/uploads/2021/11/VASOS-PARA-MICHELADA-PORTADA.jpg",
            ingredients: [
                { name: "Beer", kcal: 150 },
                { name: "Lime Juice", kcal: 20 },
                { name: "Hot Sauce", kcal: 5 },
                { name: "Spices", kcal: 5 },
                { name: "Ice", kcal: 0 },
                { name: "Salt", kcal: 0 },
            ],
            totalKcals: 180, // Sum of kcal values
        },
        {
            category: "Drink",
            name: "Tamarindo Jarritos",
            shortDescription: "Tamarind-flavored soda",
            longDescription:
                "A sweet and tangy Mexican soda made with tamarind flavoring and cane sugar.",
            price: 1.99,
            image: "https://popmenucloud.com/cdn-cgi/image/width%3D1200%2Cheight%3D1200%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/bzljmwpr/452e1102-2fd4-4698-a248-747b38a47691.jpg",
            ingredients: [
                { name: "Tamarind Flavoring", kcal: 50 },
                { name: "Cane Sugar", kcal: 100 },
                { name: "Carbonated Water", kcal: 0 },
            ],
            totalKcals: 150, // Sum of kcal values
        },
        {
            category: "Drink",
            name: "Café de Olla",
            shortDescription: "Traditional Mexican coffee",
            longDescription:
                "A traditional Mexican coffee brewed with cinnamon and piloncillo, served hot.",
            price: 3.99,
            image: "https://www.gastrolabweb.com/u/fotografias/m/2023/8/23/f1280x720-51519_183194_5050.jpg",
            ingredients: [
                { name: "Coffee", kcal: 5 },
                { name: "Cinnamon", kcal: 10 },
                { name: "Piloncillo", kcal: 50 },
                { name: "Water", kcal: 0 },
            ],
            totalKcals: 65, // Sum of kcal values
        },
        {
            category: "Drink",
            name: "Cucumber Lime Agua Fresca",
            shortDescription: "Refreshing cucumber lime drink",
            longDescription:
                "A light and refreshing drink made from cucumber, lime juice, and sugar, served over ice.",
            price: 2.99,
            image: "https://cheforopeza.com.mx/wp-content/uploads/2019/03/agua-pepino.jpg",
            ingredients: [
                { name: "Cucumber", kcal: 50 },
                { name: "Lime Juice", kcal: 20 },
                { name: "Sugar", kcal: 100 },
                { name: "Water", kcal: 0 },
                { name: "Ice", kcal: 0 },
            ],
            totalKcals: 170, // Sum of kcal values
        },
    ];

    const promos = [
        {
            image: "https://media-cdn.tripadvisor.com/media/photo-s/18/f9/75/76/la-promocion-de-comida.jpg",
        },
        {
            image: "https://images.squarespace-cdn.com/content/v1/63cecb343c41c329a4aed5da/d4b732cf-a7fb-4a50-9769-47a701f74f62/Banner-Web--taquear-chingon.jpg",
        },
    ];

    const [amount, setAmount] = React.useState(0);

    function add() {
        setAmount(amount + 1);
    }

    function substract() {
        setAmount(amount - 1);
    }

    return (
        <div className="py-7 px-14">
            <div className="h-full flex justify-center mb-8">
                <Carousel className="w-full h-[12rem] md:h-[20rem] lg:h-[25rem] -z-10">
                    <CarouselContent>
                        {promos.map((item, index) => (
                            <CarouselItem key={index} className="">
                                <div className="flex items-center justify-center p-4">
                                    <img
                                        className="rounded-lg h-[12rem] md:h-[20rem] lg:h-[25rem]"
                                        src={item.image}
                                        alt=""
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <h1 className="text-3xl mb-4 font-light text-center">
                Explore Our Menu
            </h1>
            <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-1 md:grid-cols-5 h-max">
                    <TabsTrigger className="flex gap-2" value="all">
                        <Utensils className="w-4 h-4" />
                        All
                    </TabsTrigger>
                    <TabsTrigger className="flex gap-2" value="drinks">
                        <GlassWater className="w-4 h-4" />
                        Drinks
                    </TabsTrigger>
                    <TabsTrigger className="flex gap-2" value="appetizers">
                        <Salad className="w-4 h-4" />
                        Appetizers
                    </TabsTrigger>
                    <TabsTrigger className="flex gap-2" value="main courses">
                        <Ham className="w-4 h-4" />
                        Main Courses
                    </TabsTrigger>
                    <TabsTrigger className="flex gap-2" value="desserts">
                        <CakeSlice className="w-4 h-4" />
                        Desserts
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    {/* Menu */}
                    <div className="flex flex-col gap-8">
                        <form className="">
                            <div className="">
                                <Input
                                    type="search"
                                    placeholder="Search menu..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                />
                            </div>
                        </form>
                        {/* Menu Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {menuData.map((item) => (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{item.name}</CardTitle>
                                        <CardDescription>
                                            <Badge variant="outline">
                                                {item.category}
                                            </Badge>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <img
                                            className="rounded-lg aspect-video mb-2"
                                            src={item.image}
                                        />
                                        <p className="font-light text-base">
                                            {item.shortDescription}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button>Add To Order</Button>
                                        <Drawer>
                                            <DrawerTrigger>
                                                <Button variant="secondary">
                                                    More Info
                                                </Button>
                                            </DrawerTrigger>
                                            <DrawerContent>
                                                <DrawerHeader>
                                                    <DrawerTitle>
                                                        {item.name} (
                                                        {item.totalKcals} kcal)
                                                    </DrawerTitle>
                                                    <DrawerDescription className="">
                                                        <div className="space-y-5">
                                                            <p className="text-left text-base">
                                                                {
                                                                    item.longDescription
                                                                }
                                                            </p>
                                                            <p className="text-base text-left font-light">
                                                                Ingredients
                                                            </p>
                                                            <ul className="text-left list-disc list-inside font-thin">
                                                                {item.ingredients.map(
                                                                    (
                                                                        ingredient
                                                                    ) => (
                                                                        <li>
                                                                            <span>
                                                                                {
                                                                                    ingredient.name
                                                                                }{" "}
                                                                                (
                                                                                {
                                                                                    ingredient.kcal
                                                                                }{" "}
                                                                                kcal)
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </DrawerDescription>
                                                </DrawerHeader>
                                                <DrawerFooter>
                                                    {/* Order Amount */}
                                                    <div className="flex justify-center pb-5">
                                                        <div className="flex items-center justify-between w-56">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 shrink-0 rounded-full"
                                                                onClick={
                                                                    substract
                                                                }
                                                                disabled={
                                                                    amount <= 0
                                                                }
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Decrease
                                                                </span>
                                                            </Button>
                                                            <div className="text-center">
                                                                <div className="text-xl font-bold tracking-tighter">
                                                                    {amount}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 shrink-0 rounded-full"
                                                                onClick={add}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Increase
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Button>
                                                        Add To Order
                                                    </Button>
                                                    <DrawerClose>
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                        >
                                                            Close
                                                        </Button>
                                                    </DrawerClose>
                                                </DrawerFooter>
                                            </DrawerContent>
                                        </Drawer>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="drinks">
                    {/* Menu */}
                    <div className="flex flex-col gap-8">
                        <form className="">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search menu..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                />
                            </div>
                        </form>
                        {/* Menu Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {menuData
                                .filter((item) => item.category === "Drink")
                                .map((item) => (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{item.name}</CardTitle>
                                            <CardDescription>
                                                <Badge variant="outline">
                                                    {item.category}
                                                </Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <img
                                                className="rounded-lg aspect-video mb-2"
                                                src={item.image}
                                                alt=""
                                            />
                                            <p className="font-light text-base">
                                                {item.shortDescription}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button>Add To Order</Button>
                                            <Drawer>
                                                <DrawerTrigger>
                                                    <Button variant="secondary">
                                                        More Info
                                                    </Button>
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <DrawerHeader>
                                                        <DrawerTitle>
                                                            {item.name} (
                                                            {item.totalKcals}{" "}
                                                            kcal)
                                                        </DrawerTitle>
                                                        <DrawerDescription>
                                                            <div className="space-y-5">
                                                                <p className="text-left text-base">
                                                                    {
                                                                        item.longDescription
                                                                    }
                                                                </p>
                                                                <p className="text-base text-left font-light">
                                                                    Ingredients
                                                                </p>
                                                                <ul className="text-left list-disc list-inside font-thin">
                                                                    {item.ingredients.map(
                                                                        (
                                                                            ingredient
                                                                        ) => (
                                                                            <li>
                                                                                <span>
                                                                                    {
                                                                                        ingredient.name
                                                                                    }{" "}
                                                                                    (
                                                                                    {
                                                                                        ingredient.kcal
                                                                                    }{" "}
                                                                                    kcal)
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <DrawerFooter>
                                                        {/* Order Amount */}
                                                        <div className="flex justify-center pb-5">
                                                            <div className="flex items-center justify-between w-56">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        substract
                                                                    }
                                                                    disabled={
                                                                        amount <=
                                                                        0
                                                                    }
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Decrease
                                                                    </span>
                                                                </Button>
                                                                <div className="text-center">
                                                                    <div className="text-xl font-bold tracking-tighter">
                                                                        {amount}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        add
                                                                    }
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Increase
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Button>
                                                            Add To Order
                                                        </Button>
                                                        <DrawerClose>
                                                            <Button
                                                                className="w-full"
                                                                variant="outline"
                                                            >
                                                                Close
                                                            </Button>
                                                        </DrawerClose>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="appetizers">
                    {/* Menu */}
                    <div className="flex flex-col gap-8">
                        <form className="">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search menu..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                />
                            </div>
                        </form>
                        {/* Menu Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {menuData
                                .filter((item) => item.category === "Appetizer")
                                .map((item) => (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{item.name}</CardTitle>
                                            <CardDescription>
                                                <Badge variant="outline">
                                                    {item.category}
                                                </Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <img
                                                className="rounded-lg aspect-video mb-2"
                                                src={item.image}
                                                alt=""
                                            />
                                            <p className="font-light text-base">
                                                {item.shortDescription}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button>Add To Order</Button>
                                            <Drawer>
                                                <DrawerTrigger>
                                                    <Button variant="secondary">
                                                        More Info
                                                    </Button>
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <DrawerHeader>
                                                        <DrawerTitle>
                                                            {item.name} (
                                                            {item.totalKcals}{" "}
                                                            kcal)
                                                        </DrawerTitle>
                                                        <DrawerDescription>
                                                            <div className="space-y-5">
                                                                <p className="text-left text-base">
                                                                    {
                                                                        item.longDescription
                                                                    }
                                                                </p>
                                                                <p className="text-base text-left font-light">
                                                                    Ingredients
                                                                </p>
                                                                <ul className="text-left list-disc list-inside font-thin">
                                                                    {item.ingredients.map(
                                                                        (
                                                                            ingredient
                                                                        ) => (
                                                                            <li>
                                                                                <span>
                                                                                    {
                                                                                        ingredient.name
                                                                                    }{" "}
                                                                                    (
                                                                                    {
                                                                                        ingredient.kcal
                                                                                    }{" "}
                                                                                    kcal)
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <DrawerFooter>
                                                        {/* Order Amount */}
                                                        <div className="flex justify-center pb-5">
                                                            <div className="flex items-center justify-between w-56">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        substract
                                                                    }
                                                                    disabled={
                                                                        amount <=
                                                                        0
                                                                    }
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Decrease
                                                                    </span>
                                                                </Button>
                                                                <div className="text-center">
                                                                    <div className="text-xl font-bold tracking-tighter">
                                                                        {amount}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        add
                                                                    }
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Increase
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Button>
                                                            Add To Order
                                                        </Button>
                                                        <DrawerClose>
                                                            <Button
                                                                className="w-full"
                                                                variant="outline"
                                                            >
                                                                Close
                                                            </Button>
                                                        </DrawerClose>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="main courses">
                    {/* Menu */}
                    <div className="flex flex-col gap-8">
                        <form className="">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search menu..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                />
                            </div>
                        </form>
                        {/* Menu Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {menuData
                                .filter(
                                    (item) => item.category === "Main Course"
                                )
                                .map((item) => (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{item.name}</CardTitle>
                                            <CardDescription>
                                                <Badge variant="outline">
                                                    {item.category}
                                                </Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <img
                                                className="rounded-lg aspect-video mb-2"
                                                src={item.image}
                                                alt=""
                                            />
                                            <p className="font-light text-base">
                                                {item.shortDescription}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button>Add To Order</Button>
                                            <Drawer>
                                                <DrawerTrigger>
                                                    <Button variant="secondary">
                                                        More Info
                                                    </Button>
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <DrawerHeader>
                                                        <DrawerTitle>
                                                            {item.name} (
                                                            {item.totalKcals}{" "}
                                                            kcal)
                                                        </DrawerTitle>
                                                        <DrawerDescription>
                                                            <div className="space-y-5">
                                                                <p className="text-left text-base">
                                                                    {
                                                                        item.longDescription
                                                                    }
                                                                </p>
                                                                <p className="text-base text-left font-light">
                                                                    Ingredients
                                                                </p>
                                                                <ul className="text-left list-disc list-inside font-thin">
                                                                    {item.ingredients.map(
                                                                        (
                                                                            ingredient
                                                                        ) => (
                                                                            <li>
                                                                                <span>
                                                                                    {
                                                                                        ingredient.name
                                                                                    }{" "}
                                                                                    (
                                                                                    {
                                                                                        ingredient.kcal
                                                                                    }{" "}
                                                                                    kcal)
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <DrawerFooter>
                                                        {/* Order Amount */}
                                                        <div className="flex justify-center pb-5">
                                                            <div className="flex items-center justify-between w-56">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        substract
                                                                    }
                                                                    disabled={
                                                                        amount <=
                                                                        0
                                                                    }
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Decrease
                                                                    </span>
                                                                </Button>
                                                                <div className="text-center">
                                                                    <div className="text-xl font-bold tracking-tighter">
                                                                        {amount}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        add
                                                                    }
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Increase
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Button>
                                                            Add To Order
                                                        </Button>
                                                        <DrawerClose>
                                                            <Button
                                                                className="w-full"
                                                                variant="outline"
                                                            >
                                                                Close
                                                            </Button>
                                                        </DrawerClose>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="desserts">
                    {/* Menu */}
                    <div className="flex flex-col gap-8">
                        <form className="">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search menu..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                />
                            </div>
                        </form>
                        {/* Menu Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {menuData
                                .filter((item) => item.category === "Dessert")
                                .map((item) => (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{item.name}</CardTitle>
                                            <CardDescription>
                                                <Badge variant="outline">
                                                    {item.category}
                                                </Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <img
                                                className="rounded-lg aspect-video mb-2"
                                                src={item.image}
                                                alt=""
                                            />
                                            <p className="font-light text-base">
                                                {item.shortDescription}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button>Add To Order</Button>
                                            <Drawer>
                                                <DrawerTrigger>
                                                    <Button variant="secondary">
                                                        More Info
                                                    </Button>
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <DrawerHeader>
                                                        <DrawerTitle>
                                                            {item.name} (
                                                            {item.totalKcals}{" "}
                                                            kcal)
                                                        </DrawerTitle>
                                                        <DrawerDescription>
                                                            <div className="space-y-5">
                                                                <p className="text-left text-base">
                                                                    {
                                                                        item.longDescription
                                                                    }
                                                                </p>
                                                                <p className="text-base text-left font-light">
                                                                    Ingredients
                                                                </p>
                                                                <ul className="text-left list-disc list-inside font-thin">
                                                                    {item.ingredients.map(
                                                                        (
                                                                            ingredient
                                                                        ) => (
                                                                            <li>
                                                                                <span>
                                                                                    {
                                                                                        ingredient.name
                                                                                    }{" "}
                                                                                    (
                                                                                    {
                                                                                        ingredient.kcal
                                                                                    }{" "}
                                                                                    kcal)
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <DrawerFooter>
                                                        {/* Order Amount */}
                                                        <div className="flex justify-center pb-5">
                                                            <div className="flex items-center justify-between w-56">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        substract
                                                                    }
                                                                    disabled={
                                                                        amount <=
                                                                        0
                                                                    }
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Decrease
                                                                    </span>
                                                                </Button>
                                                                <div className="text-center">
                                                                    <div className="text-xl font-bold tracking-tighter">
                                                                        {amount}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                                    onClick={
                                                                        add
                                                                    }
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Increase
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Button>
                                                            Add To Order
                                                        </Button>
                                                        <DrawerClose>
                                                            <Button
                                                                className="w-full"
                                                                variant="outline"
                                                            >
                                                                Close
                                                            </Button>
                                                        </DrawerClose>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
