
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
    quote: "OPSIGHT has revolutionized how we manage our properties. The real-time insights are game-changing."
  },
  {
    name: "Michael Chen",
    title: "Property Owner",
    company: "Chen Investment Holdings",
    quote: "Finally, a platform that puts owners first. I can see everything happening with my properties instantly."
  },
  {
    name: "OPSIGHT CEO",
    title: "Chief Executive Officer",
    company: "OPSIGHT",
    quote: "OPSIGHT is the future of property management intelligence.",
    featured: true
  },
  {
    name: "Jessica Martinez",
    title: "Real Estate Investor",
    company: "Martinez Properties",
    quote: "The predictive analytics have saved me from costly surprises. This is what we've been waiting for."
  },
  {
    name: "David Thompson",
    title: "Asset Manager",
    company: "Thompson Capital",
    quote: "OPSIGHT gives us the transparency and control we need to maximize our property investments."
  }
];

const TestimonialsCarousel = () => {
  return (
    <div className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
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
                  <div className={`bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-6 h-full flex flex-col border ${
                    testimonial.featured ? 'ring-2 ring-blue-500 transform scale-105' : ''
                  }`}>
                    <div className="flex-1 mb-4">
                      <blockquote className="text-gray-800 text-center text-sm mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-900 font-bold text-sm mb-1">
                        {testimonial.name.toUpperCase()}
                      </div>
                      <div className="text-gray-600 text-xs">
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
          <CarouselPrevious className="left-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50" />
          <CarouselNext className="right-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50" />
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
