import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const SmartOrderCarousel = () => {
  const promos = [
    {
      image:
        "https://images.unsplash.com/photo-1556742205-e10c9486e506?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image:
        "https://images.squarespace-cdn.com/content/v1/63cecb343c41c329a4aed5da/d4b732cf-a7fb-4a50-9769-47a701f74f62/Banner-Web--taquear-chingon.jpg",
    },
  ];
  return (
    <div className="relative mb-8">
      <Carousel className="w-full h-[12rem] md:h-[20rem] lg:h-[25rem]">
        <CarouselContent>
          {promos.map((item, index) => (
            <CarouselItem key={index}>
              <div className="flex items-center justify-center p-4">
                <img
                  className="rounded-lg h-[12rem] md:h-[20rem] lg:h-[25rem] w-full object-cover"
                  src={item.image}
                  alt={`Promo ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <CarouselPrevious className="relative left-0 bg-white/30 hover:bg-white/50" />
          <CarouselNext className="relative right-0 bg-white/30 hover:bg-white/50" />
        </div>
      </Carousel>
    </div>
  );
};

export default SmartOrderCarousel;
