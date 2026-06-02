import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import API from "../utils/api";
import Cards from "./Cards";

function TrendingBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTrendingBooks = async () => {
            try {
                const response = await API.get('/book/trending');
                setBooks(response.data || []);
            } catch (error) {
                console.error('Error fetching trending books:', error);
            } finally {
                setLoading(false);
            }
        };
        getTrendingBooks();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    if (loading || books.length === 0) return null;

    return (
        <section className="py-16 bg-white dark:bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                            <span className="text-orange-500">🔥</span> Trending Now
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            The most popular books everyone is reading right now.
                        </p>
                    </div>
                </div>

                <div className="slider-container -mx-3">
                    <Slider {...settings}>
                        {books.map((item) => (
                            <div key={item._id} className="px-3">
                                <Cards item={item} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default TrendingBooks;
