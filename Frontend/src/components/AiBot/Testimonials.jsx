import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    { text: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.", author: "John Smith", position: "Marketing Director at XYZ Corp" },
    { text: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.", author: "John Smith", position: "Marketing Director at XYZ Corp" },
    { text: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.", author: "John Smith", position: "Marketing Director at XYZ Corp" }
  ];

  useEffect(() => {
    let interval;
    if (!isPaused) interval = setInterval(() => nextSlide(), 5000);
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
      <div className="flex flex-col items-center justify-center pt-8 bg-surface">
        <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4 text-center font-heading">Testimonials</h2>
        <p className="text-text-light text-lg mb-6 text-center max-w-2xl px-4">
          Let us know your allergies and medical history -- so we can treat you, not your peanut butter cravings!
        </p>
      </div>
      <div className="bg-card border border-border p-8 mx-4 lg:mx-14 rounded-2xl max-w-4xl mx-auto relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-border">
          <div className={`h-full bg-primary transition-all duration-[5000ms] ease-linear ${isPaused ? 'w-0' : 'w-full'}`} />
        </div>
        <div className="overflow-hidden relative">
          <div className="flex transition-transform duration-[600ms] ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="bg-surface-alt border border-border rounded-2xl p-6 mb-4">
                  <p className="text-text text-base leading-relaxed">&quot;{testimonial.text}&quot;</p>
                </div>
                <div className="text-center">
                  <h3 className="text-primary font-semibold mb-1">{testimonial.author}</h3>
                  <p className="text-muted text-sm">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-light hover:text-primary transition-colors disabled:opacity-50 bg-card border border-border rounded-full p-1 shadow-sm" disabled={isAnimating} aria-label="Previous slide">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-light hover:text-primary transition-colors disabled:opacity-50 bg-card border border-border rounded-full p-1 shadow-sm" disabled={isAnimating} aria-label="Next slide">
          <ChevronRight size={20} />
        </button>
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button key={index} onClick={() => handleDotClick(index)} className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-primary scale-125' : 'bg-border hover:bg-muted'}`} disabled={isAnimating} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonial;
