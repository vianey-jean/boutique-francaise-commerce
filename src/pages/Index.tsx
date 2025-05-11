
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedCategories from '@/components/FeaturedCategories';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoBanner from '@/components/PromoBanner';
import Testimonials from '@/components/Testimonials';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ElégantShop - Premium Online Store</title>
        <meta name="description" content="Discover premium products for your modern lifestyle at ElégantShop. Free shipping on orders over $50." />
      </Helmet>
      
      <Header />
      
      <main>
        <Hero />
        <FeaturedCategories />
        <FeaturedProducts />
        <PromoBanner />
        <Testimonials />
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
