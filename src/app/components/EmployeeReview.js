"use client";
import Image from "next/image";

export default function EmployeeReview() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Tasker",
      comment:
        "GoZipply has completely transformed the way I work. I can choose my tasks, set my schedule, and earn money on my own terms. It's reliable and easy to use!",
      img: "/employee1.jpg", // employee image path
    },
    {
      name: "Mark Thompson",
      role: "Tasker",
      comment:
        "Being a Tasker gives me flexibility and control over my work. The platform is simple, and the support team is always helpful.",
      img: "/employee2.jpg",
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-8 md:px-16 space-y-16">
      <h1 className="text-3xl font-bold text-center mb-12">Employee Reviews</h1>

      {reviews.map((review, index) => (
        <div
          key={index}
          className={`grid grid-cols-1 md:grid-cols-2 items-center gap-8 ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Left Side - Comment */}
          <div className="flex flex-col justify-center bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-700 text-lg mb-4">{review.comment}</p>
            <p className="font-semibold text-gray-900">{review.name}</p>
            <p className="text-gray-500">{review.role}</p>
          </div>

          {/* Right Side - Image */}
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={review.img}
              alt={review.name}
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
