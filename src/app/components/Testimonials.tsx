import { Component } from "react";
import { motion } from "motion/react";
import Slider from "react-slick";
import { Quote, Star } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { fetchTestimonials, type Testimonial } from "@/services/testimonial";

type TestimonialsProps = {
  userId: string;
};

type TestimonialsState = {
  error: string | null;
  isLoading: boolean;
  testimonials: Testimonial[];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default class Testimonials extends Component<
  TestimonialsProps,
  TestimonialsState
> {
  private isMountedComponent = false;
  private requestId = 0;

  state: TestimonialsState = {
    error: null,
    isLoading: true,
    testimonials: [],
  };

  private settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  componentDidMount() {
    this.isMountedComponent = true;
    void this.loadTestimonials();
  }

  componentDidUpdate(prevProps: TestimonialsProps) {
    if (prevProps.userId !== this.props.userId) {
      void this.loadTestimonials();
    }
  }

  componentWillUnmount() {
    this.isMountedComponent = false;
  }

  private async loadTestimonials() {
    const currentRequestId = this.requestId + 1;
    this.requestId = currentRequestId;

    this.setState({ error: null, isLoading: true });

    try {
      const testimonials = await fetchTestimonials(this.props.userId);

      if (this.isMountedComponent && currentRequestId === this.requestId) {
        this.setState({ testimonials, isLoading: false });
      }
    } catch (error) {
      if (this.isMountedComponent && currentRequestId === this.requestId) {
        this.setState({
          error:
            error instanceof Error ? error.message : "Unable to load testimonials.",
          isLoading: false,
          testimonials: [],
        });
      }
    }
  }

  render() {
    const { error, isLoading, testimonials } = this.state;

    if (!isLoading && !error && testimonials.length === 0) return null;

    return (
      <section className="py-24 px-6 relative overflow-hidden bg-slate-900/50">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Client Testimonials
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            What clients say about working with me
          </p>
        </motion.div>

        <div className="testimonials-slider">
          {isLoading && (
            <div className="grid md:grid-cols-2 gap-8">
              {[0, 1].map((item) => (
                <div
                  key={item}
                  className="h-80 rounded-2xl border border-slate-700/50 bg-slate-800/40 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
              {error}
            </div>
          )}

          {!isLoading && testimonials.length > 0 && (
            <Slider {...this.settings}>
              {testimonials.map((testimonial, index) => (
                <div key={testimonial._id} className="px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 group"
                    style={{
                      boxShadow:
                        "0 20px 60px -20px rgba(0, 0, 0, 0.5), 0 0 40px -10px rgba(6, 182, 212, 0.1)",
                    }}
                  >
                  {/* Quote Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(Math.max(0, Math.min(5, testimonial.rating)))].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                    "{testimonial.description}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-50" />
                      {testimonial.image ? (
                        <img
                          src={testimonial.image.url}
                          alt={testimonial.image.alt}
                          className="relative w-14 h-14 rounded-full object-cover border-2 border-slate-700"
                        />
                      ) : (
                        <div className="relative w-14 h-14 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center text-sm font-bold text-cyan-300">
                          {getInitials(testimonial.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {testimonial.designation}
                      </div>
                    </div>
                  </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      <style>{`
        .testimonials-slider .slick-dots {
          bottom: -50px;
        }
        .testimonials-slider .slick-dots li button:before {
          color: #06b6d4;
          opacity: 0.3;
          font-size: 10px;
        }
        .testimonials-slider .slick-dots li.slick-active button:before {
          opacity: 1;
        }
        .testimonials-slider .slick-prev,
        .testimonials-slider .slick-next {
          display: none !important;
        }
      `}</style>
      </section>
    );
  }
}
