// ServiceCategories.jsx

import Link from "next/link";
import ServicesData from "../data/ServicesLinks";

const ServicesCategories = () => {
  return (
    <>
      <section className="w-full bg-white py-16 px-6 md:px-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Hire a trusted Tasker presto.
        </h2>

        {/* Grid of categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ServicesData.map((service, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-sm p-4 bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="overflow-hidden rounded-md mb-4">
                <img
                  src={service.banner}
                  alt={service.title}
                  className="w-full h-40 object-cover rounded-md transition-transform duration-500 hover:scale-110"
                />
              </div>

              <Link href={service.href}>
                <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 hover:text-yellow-600">
                  {service.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-600 mb-4">{service.description}</p>

              <ul className="space-y-1">
                {service.subServices?.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-gray-700 text-sm transition-colors duration-200 hover:text-yellow-600"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <div className="mt-2 grid md:grid-cols-2 gap-0">
        <div className="bg-white rounded-2xl flex-col items-center flex justify-center p-10 hover:bg-gray-50 transition-colors duration-300">
          <h3 className="text-2xl font-bold text-gray-800 mb-10 transition-colors duration-300 hover:text-yellow-600">
            BRIT+CO
          </h3>
          <p className="text-gray-600 text-lg text-center italic transition-transform duration-300 hover:scale-105">
            “Taskrabbit is arguably the best thing to come out of the modern-day
            tech revolution. Hiring a Tasker can really help make every facet of your
            life a breeze.”
          </p>
        </div>

        <div className="bg-white rounded-2xl flex-col items-center flex justify-center p-10 hover:bg-gray-50 transition-colors duration-300">
          <h3 className="text-2xl font-bold text-gray-800 mb-10 transition-colors duration-300 hover:text-yellow-600">
            The New York Times
          </h3>
          <p className="text-gray-600 text-lg text-center italic transition-transform duration-300 hover:scale-105">
            “Taskrabbit, a company known for, among other things, sending
            tool-wielding workers to rescue customers befuddled by
            build-it-yourself furniture kits.”
          </p>
        </div>
      </div>
    </>
  );
};

export default ServicesCategories;
