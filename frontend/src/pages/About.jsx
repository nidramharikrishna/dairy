function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About Dairy</h1>

      <p className="text-lg text-softText leading-8">
        Dairy is an online platform providing fresh milk, curd, paneer,
        butter, ghee and other dairy products directly to customers.
        Our mission is to deliver quality dairy products at affordable prices
        while maintaining freshness and purity.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-bold text-xl mb-2">Fresh Products</h2>
          <p>Directly sourced and delivered fresh.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-bold text-xl mb-2">Quality Assured</h2>
          <p>High quality standards for every product.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-bold text-xl mb-2">Fast Delivery</h2>
          <p>Quick and reliable doorstep delivery.</p>
        </div>
      </div>
    </div>
  );
}

export default About;