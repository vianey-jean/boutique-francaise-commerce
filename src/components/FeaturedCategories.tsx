
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop',
    count: 24
  },
  {
    id: 2,
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&auto=format&fit=crop',
    count: 18
  },
  {
    id: 3,
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1623110311324-bc547734b10f?w=800&auto=format&fit=crop',
    count: 32
  }
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-store-dark-blue mb-2">
            Featured Categories
          </h2>
          <p className="text-gray-500">Browse our most popular product categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.id}`} 
              key={category.id} 
              className="group overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl relative"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                <p className="opacity-80">{category.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
