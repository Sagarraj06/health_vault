import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      text: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.",
      author: "John Smith",
      position: "Marketing Director at XYZ Corp"
    },
    {
      text: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.",
      author: "John Smith",
      position: "Marketing Director at XYZ Corp"
    },
    {
      text: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.",
      author: "John Smith",
      position: "Marketing Director at XYZ Corp"
    }
  ];

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 600);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 10000);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 600);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 10000);
    }
  };

  const handleDotClick = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 600);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 10000);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-8 bg-dark">
        <h2 className="text-5xl font-bold text-primary mb-8 text-center"> Testimonials</h2>
        <p className="text-gray-300 text-xl mb-6">
          Let us know your allergies and medical history—so we can treat you, not your peanut butter cravings!
        </p>
      </div>
      <div className="bg-surface p-8 m-14 rounded-3xl max-w-4xl mx-auto relative overflow-hidden border border-white/10">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
          <div
            className={`h-full bg-primary transition-all duration-[5000ms] ease-linear ${isPaused ? 'w-0' : 'w-full'
              }`}
          />
        </div>

        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-[600ms] ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-4 transform transition-opacity duration-500"
              >
                <div
                  className="bg-transparent border-2 border-primary rounded-3xl p-6 mb-4 transform transition-all duration-500 hover:scale-[1.02] hover:border-primary/80"
                >
                  <p className="text-white text-lg">&quot;{testimonial.text}&quot;</p>
                </div>
                <div className="text-center transform transition-all duration-500">
                  <h3 className="text-primary font-medium mb-1">{testimonial.author}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons with hover effects */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-all duration-300 hover:scale-110 disabled:opacity-50"
          disabled={isAnimating}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-all duration-300 hover:scale-110 disabled:opacity-50"
          disabled={isAnimating}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Navigation with animations */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 transform ${currentSlide === index
                  ? 'bg-primary scale-125'
                  : 'bg-gray-600 hover:bg-primary/50'
                }`}
              disabled={isAnimating}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonial;