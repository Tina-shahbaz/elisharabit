"use client";
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Features() {
  const features = [
    {
      title: "Be your own boss",
      description:
        "Work how, when, and where you want. Offer services in 50+ categories and set a flexible schedule and work area.",
      icon: UserGroupIcon,
    },
    {
      title: "Set your own rates",
      description:
        "You keep 100% of what you charge, plus tips! Invoice and get paid directly through our secure payment system.",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Grow your business",
      description:
        "We connect you with clients in your area, and ways to market yourself — so you can focus on what you do best.",
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="py-24 px-6 md:px-20 bg-gray-50">
      <h2 className="text-5xl font-bold text-center mb-12">
        Flexible work, at your fingertips
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Find local jobs that fit your skills and schedule. With GoZipply, you have the freedom and support to be your own boss.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <feature.icon className="h-16 w-16 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
