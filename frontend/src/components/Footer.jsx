import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-white border-t mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">

                <div className="grid md:grid-cols-4 gap-10">

                    <div>
                        <h2 className="text-2xl font-bold text-sky mb-3">
                            🥛 Dairy
                        </h2>

                        <p className="text-softText">
                            Fresh dairy products delivered to your doorstep.
                            Pure quality. Fresh taste.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Quick Links
                        </h3>


                        <div className="flex flex-col gap-2 text-softText">
                            <Link to="/about">About</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/cart">Cart</Link>
                            <Link to="/orders">Orders</Link>
                            <Link to="/profile">Profile</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Categories
                        </h3>

                        <div className="flex flex-col gap-2 text-softText">
                            <Link to="/products/category/milk">Milk</Link>
                            <Link to="/products/category/curd">Curd</Link>
                            <Link to="/products/category/paneer">Paneer</Link>
                            <Link to="/products/category/ghee">Ghee</Link>
                            <Link to="/products/category/butter">Butter</Link>
                            <Link to="/products/category/cheese">Cheese</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Contact
                        </h3>

                        <div className="space-y-2 text-softText">
                            <p>📍 Hyderabad, Telangana</p>
                            <p>📞 +91 98765 43210</p>
                            <p>✉ support@dairy.com</p>
                        </div>
                    </div>

                </div>

                <hr className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="text-softText text-sm">
                        © 2026 Dairy. All Rights Reserved.
                    </div>

                    <div className="flex gap-4 text-xl">
                        <a href="#">📘</a>
                        <a href="#">📷</a>
                        <a href="#">💬</a>
                    </div>

                </div>

            </div>
        </footer>
    );
}

export default Footer;