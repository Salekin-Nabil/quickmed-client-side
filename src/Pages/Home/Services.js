import React from "react";
import qmed_1 from "../../assets/images/services_image/qmed-1.jpg";
import qmed_2 from "../../assets/images/services_image/qmed-2.jpg";
import qmed_3 from "../../assets/images/services_image/qmed-3.jpg";
import qmed_4 from "../../assets/images/services_image/qmed-4.jpg";
import qmed_5 from "../../assets/images/services_image/qmed-5.jpg";
import qmed_6 from "../../assets/images/services_image/qmed-6.jpg";
import qmed_7 from "../../assets/images/services_image/qmed-7.jpg";
import qmed_8 from "../../assets/images/services_image/qmed-8.jpg";
import qmed_9 from "../../assets/images/services_image/qmed-9.jpg";
import qmed_10 from "../../assets/images/services_image/qmed-10.jpg";
import qmed_11 from "../../assets/images/services_image/qmed-11.jpg";
import qmed_12 from "../../assets/images/services_image/qmed-12.jpg";
import Service from "./Service";
import { pl } from "date-fns/locale";

const Services = () => {
  const services = [
    {
      _id: 1,
      name: "AI Symptom Checker",
      description:
        "Get instant, AI-driven insights into your symptoms for a quick health evaluation.",
      img: qmed_1,
    },
    {
      _id: 2,
      name: "Instant Doctor Consultation",
      description:
        "Connect with a licensed doctor in minutes for personalized medical advice.",
      img: qmed_2,
    },
    {
      _id: 3,
      name: "Prescription Assistance",
      description:
        "Receive prescriptions quickly, whether through AI suggestions or direct from a doctor.",
      img: qmed_3,
    },
    {
      _id: 4,
      name: "Emergency Health Advice",
      description:
        "Immediate guidance for urgent health situations, available anytime, anywhere.",
      img: qmed_4,
    },
    {
      _id: 5,
      name: "Virtual Health Monitoring",
      description:
        "Track your vital signs and health trends with real-time updates and AI analysis.",
      img: qmed_5,
    },
    {
      _id: 6,
      name: "Chronic Condition Support",
      description:
        "Ongoing management of chronic conditions with tailored care plans and expert advice.",
      img: qmed_6,
    },
    {
      _id: 7,
      name: "Specialist Referrals",
      description:
        "Fast and seamless referrals to specialists when you need advanced medical care.",
      img: qmed_7,
    },
    {
      _id: 8,
      name: "Follow-Up Care Guidance",
      description:
        "Get follow-up care recommendations and reminders after consultations or procedures.",
      img: qmed_8,
    },
    {
      _id: 9,
      name: "Medication Reminders",
      description:
        "Stay on top of your prescriptions with personalized, timely medication alerts.",
      img: qmed_9,
    },
    {
      _id: 10,
      name: "Mental Health Support",
      description:
        "Access mental health resources and talk to professionals whenever you need emotional support.",
      img: qmed_10,
    },
    {
      _id: 11,
      name: "Lab Test Review",
      description:
        "Upload and review lab test results with expert commentary and next-step recommendations.",
      img: qmed_11,
    },
    {
      _id: 12,
      name: "Pediatric Urgent Care",
      description:
        "Quick, reliable care for children’s health concerns, available around the clock.",
      img: qmed_12,
    },
  ];
  return (
    <div className="my-28">
      <div className="text-center">
        <h3 className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-xl font-bold uppercase">
          Our Services
        </h3>
        <h2 className="text-4xl">Services We Provide</h2>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {!!services &&
          services.map((service) => (
            <Service key={service._id} service={service}></Service>
          ))}
      </div>
    </div>
  );
};

export default Services;
