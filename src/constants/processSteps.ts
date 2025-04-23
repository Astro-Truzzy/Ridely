import signup from "../assets/Images/signup.png";
import bookrider from "../assets/Images/upscalemedia-transformed (1).png";
import details from "../assets/Images/package-location-3d-icon-download-in-png-blend-fbx-gltf-file-formats--parcel-delivery-tracking-and-navigation-pack-services-icons-7191762-removebg-preview.png";
import otw from "../assets/Images/delivered-removebg-preview.png";

export const processSteps = [
  {
    title: "Sign Up",
    description:
      "Easily create an account in seconds and access a smooth delivery experience instantly.",
    icon: signup,
    delay: 200,
  },
  {
    title: "Book a Rider",
    description:
      "Quickly request a nearby dispatch rider with just a few taps on the app.",
    icon: bookrider,
    delay: 400,
  },
  {
    title: "Enter Details",
    description:
      "Fill in pickup and delivery info, choose parcel size, and get instant cost estimates.",
    icon: details,
    delay: 600,
  },
  {
    title: "OTW!",
    description:
      "Track your package in real-time and enjoy timely, secure deliveries to your doorstep.",
    icon: otw,
    delay: 800,
  },
];
