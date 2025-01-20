"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import heroImage from "@/public/hero-image3.jpg";
// import aboutUs from "@/public/about-us.jpg";
import Image from "next/image";
import Link from "next/link";
import Chatbot from "./components/Chatbot";

const Page = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("login/api/authentication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const passEmail = data.data?.email; // Use optional chaining to safely access the property
      console.log(passEmail);

      // Check the response status
      // if response has error
      if (response.status === 404) {
        setIsLoading(false);
        setError("Email id or password is incorrect");
      }

      // if role is superadmin
      else if ((response.status === 200 || 201) && data.role === "superadmin") {
        console.log(data.role);
        router.push(
          `/superadmin?email=${encodeURIComponent(JSON.stringify(passEmail))}`
        );
      }

      // if role is admin
      else if ((response.status === 200 || 201) && data.role === "admin") {
        router.push(
          `/admin?email=${encodeURIComponent(JSON.stringify(passEmail))}`
        );
      }

      // If role is doctor
      if (data.role === "doctor") {
        // Check if secretKey exists
        if (data.data?.secretKey) {
          const secretKey = data.data.secretKey;

          // Navigate with both passEmail and secretKey
          router.push(
            `/doctor?email=${encodeURIComponent(
              passEmail
            )}&secretKey=${encodeURIComponent(secretKey)}`
          );
        } else if (response.status === 200 || response.status === 201) {
          // Navigate with just passEmail if secretKey doesn't exist
          router.push(`/doctor?email=${encodeURIComponent(passEmail)}`);
        }
      }

      // if role is patient
      else if ((response.status === 200 || 201) && data.role === "patient") {
        router.push(
          `/patient?email=${encodeURIComponent(JSON.stringify(passEmail))}`
        );
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("An error occurred during login");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bottom-12 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundAttachment: "fixed",
          height: "99vh", // Use viewport height for better responsiveness
        }}
      >
        {/* Overlay for dim effect */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Hero Content */}
        <div className="relative z-10">
          <Navbar />
          <Chatbot />
          <main className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 items-center justify-center p-6 text-center text-white">
            <div className="mt-96 font-bold text-5xl ">
              <h1>Welcome to CharakDT</h1>
              <h2>Human Digital Twin Platform for Healthcare</h2>
            </div>
          </main>
        </div>
      </div>

      {/* About Section */}
      <section
        id="about"
        className="flex flex-row-2 pt-8 pb-12 bg-gray-50 text-gray-800"
      >
        {/* Image */}
        <div></div>

        {/* content */}
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl  text-center mb-8">About Us</h2>
          <p className="text-lg text-center mb-12 max-w-3xl mx-auto text-gray-700">
            CharakDT is a unified interface that digitally links all healthcare
            advances and participants in the nation. The platform aims to
            facilitate patient-centric healthcare delivery through enhanced
            efficiency and cost savings, streamlining healthcare processes and
            optimizing resource allocation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image src={"/icon1.png"} alt="Icon" width={50} height={50} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                Create a digital healthcare ecosystem connecting players
                nationwide.
              </p>
            </div>
            {/* Digital Infrastructure Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image src={"/icon2.png"} alt="Icon" width={50} height={50} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Digital Infrastructure
              </h3>
              <p className="text-gray-600">
                Leverage smart wearables, IoT, AI, remote monitoring, and big
                data analytics to drive transformative healthcare solutions.
              </p>
            </div>
            {/* Global Framework Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image src={"/icon3.png"} alt="Icon" width={50} height={50} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Framework</h3>
              <p className="text-gray-600">
                Develop a global governance framework for interoperability while
                addressing concerns around digital health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision and Mission Section */}
      <section
        id="vision-mission"
        className="py-16 bg-white text-gray-800 text-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl  mb-6">Our Vision and Mission</h2>

          {/* Vision and Mission Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image
                  src={"/vision-icon.png"}
                  alt="Vision Icon"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                To revolutionize healthcare through digital twins, creating a
                sustainable, patient-centric ecosystem that enhances health
                outcomes globally.
              </p>
            </div>

            {/* Mission Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image
                  src={"/mission-icon.png"}
                  alt="Mission Icon"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To create a unified healthcare ecosystem that connects patients,
                providers, and technology, ensuring better health outcomes
                through data-driven insights and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors and Patients Section */}
      <section
        id="vision-mission"
        className="py-16 bg-gray-50 text-gray-800 text-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl mb-6">Whom Do We Cater To</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Doctor Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image
                  src={"/doctor-icon.png"}
                  alt="Vision Icon"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Doctor</h3>
              <button
                onClick={togglePopup}
                className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-4 rounded"
              >
                Go to Doctors
              </button>
            </div>

            {/* Patient Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image
                  src={"/patient-icon.png"}
                  alt="Vision Icon"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Patients</h3>
              <Link href="/patient">
                <button className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-4 rounded">
                  Go to Patients
                </button>
              </Link>
            </div>

            {/* Admin Card */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Image
                  src={"/admin-icon.png"}
                  alt="Vision Icon"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin</h3>
              <button
                onClick={togglePopup}
                className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-4 rounded"
              >
                Go to Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pop-Up Login Menu */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div> 
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                onClick={handleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
            <button
              onClick={togglePopup}
              className="mt-4 w-full text-center text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section
        id="services"
        className="py-16 bg-white text-gray-800 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl  mb-6">Our Services</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Digital Twin Modeling
              </h3>
              <p>Accurate modeling for healthcare applications.</p>
            </li>
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Real-Time Monitoring
              </h3>
              <p>
                Real-time data analysis and visualization for patient health.
              </p>
            </li>
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Predictive Analytics
              </h3>
              <p>Predicting healthcare outcomes with advanced algorithms.</p>
            </li>
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Integration Services
              </h3>
              <p>Seamless integration with existing healthcare systems.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Application Areas Section */}
      <section
        id="application-areas"
        className="py-16 bg-gray-50 text-gray-800 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl  mb-6">Application Areas</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Hospitals</h3>
              <p>Improving patient care with digital twin solutions.</p>
            </li>
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Clinics</h3>
              <p>Optimizing clinic workflows with real-time data.</p>
            </li>
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Research Centers</h3>
              <p>Empowering researchers with predictive analytics tools.</p>
            </li>
            <li className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Home Healthcare</h3>
              <p>Providing insights for home-based healthcare monitoring.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 bg-white text-gray-800 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl  mb-6">Contact Us</h2>
          <p className="text-lg mb-4">Have questions? Get in touch with us!</p>
          <form className="grid gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-4 border rounded-md"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-4 border rounded-md"
            />
            <textarea
              placeholder="Your Message"
              className="p-4 border rounded-md"
              rows={4}
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Page;
