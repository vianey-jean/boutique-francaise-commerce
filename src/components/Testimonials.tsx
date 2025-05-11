
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Interior Designer",
    rating: 5,
    comment: "The quality of the products exceeded my expectations. I've furnished my entire office with items from ElégantShop and couldn't be happier.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Michael Thompson",
    role: "Tech Enthusiast",
    rating: 5,
    comment: "Fast shipping and the electronics I purchased work flawlessly. The customer service team was also extremely helpful with my questions.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Fashion Blogger",
    rating: 4,
    comment: "I love the unique selection of clothing available here. The materials are high quality and the designs are truly elegant and timeless.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const RatingStars = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-store-purple text-store-purple" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-store-dark-blue mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500">Hear from our satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <RatingStars rating={testimonial.rating} />
              <p className="mt-4 text-gray-600 italic">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
