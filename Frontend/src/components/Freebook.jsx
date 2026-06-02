import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import API from "../utils/api";
import Cards from "./Cards";

function Freebook() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFreeBooks = async () => {
            try {
                // Fetch using our API to get free books
                const response = await API.get('/book?isFree=true');
                // The API returns { books, pagination }
                setBooks(response.data.books || []);
            } catch (error) {
                console.error('Error fetching free books:', error);
            } finally {
                setLoading(false);
            }
        };
        getFreeBooks();
    }, []);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true } },
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    if (loading || books.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50 dark:bg-dark-hover/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Free Offered Books</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Start learning today with our collection of free resources.
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

export default Freebook;
