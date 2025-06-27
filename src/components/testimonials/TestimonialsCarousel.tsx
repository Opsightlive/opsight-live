
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Portfolio Manager",
    company: "Prime Real Estate Group",
    quote: "OPSIGHT has revolutionized how we manage our properties. The real-time insights are game-changing.",
    image: "/lovable-uploads/397c940b-b808-40a6-bc06-a8dc80a7bdbb.png"
  },
  {
    name: "Michael Chen",
    title: "Property Owner",
    company: "Chen Investment Holdings",
    quote: "Finally, a platform that puts owners first. I can see everything happening with my properties instantly.",
    image: "/lovable-uploads/9edc7ad5-5173-495d-9d7c-86beb88ab558.png"
  },
  {
    name: "OPSIGHT CEO",
    title: "Chief Executive Officer",
    company: "OPSIGHT",
    quote: "OPSIGHT is the future of property management intelligence.",
    image: "/lovable-uploads/126f59a2-9c39-4959-8839-f7491c94712a.png",
    featured: true
  },
  {
    name: "Jessica Martinez",
    title: "Real Estate Investor",
    company: "Martinez Properties",
    quote: "The predictive analytics have saved me from costly surprises. This is what we've been waiting for.",
    image: "/lovable-uploads/ec57def0-b7fa-4e5d-b2ad-70a4b7714701.png"
  },
  {
    name: "David Thompson",
    title: "Asset Manager",
    company: "Thompson Capital",
    quote: "OPSIGHT gives us the transparency and control we need to maximize our property investments.",
    image: "/lovable-uploads/735f0723-47f3-498a-88a7-8bdef80978f9.png"
  }
];

const TestimonialsCarousel = () => {
  return (
    <div className="bg-black py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">
            WHAT INDUSTRY LEADERS HAVE TO SAY
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <div className="h-full">
                  <div className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 h-full flex flex-col ${
                    testimonial.featured ? 'ring-2 ring-blue-500 transform scale-105' : ''
                  }`}>
                    <div className="flex-1 mb-4">
                      <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <blockquote className="text-white text-center text-sm mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-sm mb-1">
                        {testimonial.name.toUpperCase()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {testimonial.title}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="right-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
