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
        "https://media-cdn.tripadvisor.com/media/photo-s/18/f9/75/76/la-promocion-de-comida.jpg",
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
